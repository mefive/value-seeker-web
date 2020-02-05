import ReactEcharts from 'echarts-for-react';
import { MobXProviderContext, useObserver, Observer } from 'mobx-react';
import React, { useMemo } from 'react';
import BasicStore from '../BasicStore';
import DailyStore from './DailyStore';

function fillEmpty<T = null, P = null>(l1: T[], l2: P[]): [T[], P[]] {
  const max = Math.max(l1.length, l2.length);
  const min = Math.min(l1.length, l2.length);

  const r1 = l1.slice(-max);
  const r2 = l2.slice(-max);

  [r1, r2].forEach((r) => {
    if (r.length !== max) {
      for (let i = 0; i < max - min; i += 1) {
        r.unshift(null);
      }
    }
  });

  return [r1, r2];
}

function DailyChart() {
  const { dailyStore, basicStore } = React.useContext<{
    dailyStore: DailyStore;
    basicStore: BasicStore;
  }>(MobXProviderContext);

  const { dailyList, dailyBasicList, basic } = useObserver(() => ({
    dailyBasicList: dailyStore.dailyBasicList,
    dailyList: dailyStore.dailyList,
    basic: basicStore.dailyBasic,
  }));

  const option = useMemo(() => {
    const listWithEmptyFilled = fillEmpty(
      dailyList.reverse(),
      dailyBasicList.reverse(),
    );

    const tradeList = listWithEmptyFilled[0];
    const basicList = listWithEmptyFilled[1];

    return {
      legend: {
        show: true,
      },
      dataZoom: [
        {
          show: true,
          type: 'slider',
          top: '90%',
          start: 90,
          end: 100,
        },
      ],
      xAxis: {
        type: 'category',
        data: tradeList.map((t) => t.tradeDate),
      },
      yAxis: [
        {
          type: 'value',
          scale: true,
          name: '价格',
        },
        {
          type: 'value',
          scale: true,
          name: '比值',
        },
      ],
      series: [
        {
          name: basic.name,
          type: 'candlestick',
          data: tradeList.map((t) => [t.open, t.close, t.low, t.high]),
          itemStyle: {
            color: '#ef232a',
            color0: '#14b143',
            borderColor: '#ef232a',
            borderColor0: '#14b143',
          },
          emphasis: {
            itemStyle: {
              color: 'black',
              color0: '#444',
              borderColor: 'black',
              borderColor0: '#444',
            },
          },
        },
        {
          name: 'PE',
          type: 'line',
          data: basicList.map((b) => b && b.peTtm),
          yAxisIndex: 1,
        },
      ],
    };
  }, [dailyList, dailyBasicList, basic]);

  return (
    <Observer>
      {() => (
        <ReactEcharts showLoading={dailyStore.load.pending} option={option} />
      )}
    </Observer>
  );
}

export default DailyChart;
