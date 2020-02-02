import React from 'react';
import { AppContext } from '../contexts';
import Sider from './Sider';

function Main() {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        collapsed,
        setCollapsed,
        getPopupContainer: () => document.body,
      }}
    >
      <div css="display: flex">
        <Sider />

        <div css="flex: 1;min-width: 0">
        right
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default Main;
