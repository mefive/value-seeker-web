import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { Router } from 'react-router-dom';
import 'antd/dist/antd.less';
import 'reflect-metadata';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { ThemeProvider } from 'styled-components';
import * as ReactDOM from 'react-dom';
import React from 'react';
import { createHistory } from '../config/history';
import { basename } from '../config/constants';
import mobxStoreSpy from '../utils/mobxStoreSpy';
import Main from './Main';
import theme from '../style/theme';

function main() {
  const history = createHistory(basename);

  mobxStoreSpy({ disabled: false });

  ReactDOM.render(
    <ConfigProvider locale={zhCN}>
      <ThemeProvider theme={theme}>
        <Router history={history}>
          <Main />
        </Router>
      </ThemeProvider>
    </ConfigProvider>,
    document.getElementById('app'),
  );
}

main();
