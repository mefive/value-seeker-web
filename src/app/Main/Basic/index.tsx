import { Provider, Observer } from 'mobx-react';
import React from 'react';
import container from '../../container';
import Basic from './Basic';
import BasicStore from './BasicStore';
import Daily from './Daily';

export default () => {
  const basicStore = container.get(BasicStore);

  return (
    <Provider basicStore={basicStore}>
      <Observer>
        {() => (basicStore.dailyBasic == null ? <Basic /> : <Daily />)}
      </Observer>
    </Provider>
  );
};
