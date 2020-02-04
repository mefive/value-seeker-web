import { ConfigProvider } from 'antd';
import 'antd/dist/antd.less';
import zhCN from 'antd/es/locale/zh_CN';
import 'core-js/stable';
import { Provider } from 'mobx-react';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import 'reflect-metadata';
import 'regenerator-runtime/runtime';
import { ThemeProvider } from 'styled-components';
import Notification from '../components/Notification';
import { basename } from '../config/constants';
import { createHistory } from '../config/history';
import container from '../container';
import NotificationStore from '../store/NotificationStore';
import theme from '../style/theme';
import mobxStoreSpy from '../utils/mobxStoreSpy';
import Main from './Main';

window.addEventListener(
  'unhandledrejection',
  (event: PromiseRejectionEvent) => {
    const { message } = event.reason as Error;

    container
      .get(NotificationStore)
      .error(message || JSON.stringify(event.reason));
  },
);

function main() {
  const history = createHistory(basename);

  mobxStoreSpy({ disabled: false });

  ReactDOM.render(
    <ConfigProvider locale={zhCN}>
      <ThemeProvider theme={theme}>
        <Provider notificationStore={container.get(NotificationStore)}>
          <>
            <Router history={history}>
              <Main />
            </Router>
            <Notification />
          </>
        </Provider>
      </ThemeProvider>
    </ConfigProvider>,
    document.getElementById('app'),
  );
}

main();
