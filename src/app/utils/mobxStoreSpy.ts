import { spy, toJS } from 'mobx';

interface Event {
  name: string;
  type: string;
  object: object;
  arguments: {}[];
}

const spyReports: Event[] = [];

interface DevTool {
  send: (action: string | {}, state: {}) => void;
  disconnect: () => void;
}

// const devTools: {
//   [s: string]: DevTool;
// } = {}

export default function (options: { storeName?: string; disabled?: boolean } = {}) {
  let devTool: DevTool;
  let rootState = {};

  const {
    storeName = 'RootStore', disabled = false,
  } = options;

  if (disabled || process.env.NODE_ENV !== 'development') {
    return;
  }

  spy(e => {
    if (e.spyReportStart) {
      spyReports.push({ ...e });
    } else if (e.spyReportEnd) {
      const event = spyReports.pop();

      if (event.type === 'action' && event.name !== 'setState') {
        const { object } = event as { object: { key?: string }};

        if (object == null) {
          return;
        }


        if ('__REDUX_DEVTOOLS_EXTENSION__' in window) {
          const storeKey = object.key || `${object.constructor.name}`;

          const state = Object.entries(object).reduce(
            (p, [key, value]) => {
              const r = { ...p };
              if (!/Store$/.test(key) && typeof value !== 'function') {
                // @ts-ignore
                r[key] = toJS(value);
              }
              return r;
            },
            {},
          );

          rootState = {
            ...rootState,
            [storeKey]: state,
          };

          if (devTool == null) {
            // eslint-disable-next-line
            devTool = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect({
              name: storeName,
            }) as DevTool;
          }
          devTool.send({
            type: `${storeKey}/${event.name}`,
            payload: event.arguments.length > 0 ? event.arguments[0] : null,
          }, rootState);
        } else {
          console.info(event.name, rootState);
        }
      }
    }
  });
}
