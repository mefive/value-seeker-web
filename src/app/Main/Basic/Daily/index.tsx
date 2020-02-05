import { Provider } from 'mobx-react';
import React from 'react';
import container from '../../../container';
import DailyStore from './DailyStore';
import Daily from './Daily';

export default () => (
  <Provider dailyStore={container.get(DailyStore)}>
    <Daily />
  </Provider>
);
