import { Provider } from 'mobx-react';
import React from 'react';
import container from '../../container';
import Basic from './Basic';
import BasicStore from './BasicStore';

export default () => (
  <Provider basicStore={container.get(BasicStore)}>
    <Basic />
  </Provider>
);
