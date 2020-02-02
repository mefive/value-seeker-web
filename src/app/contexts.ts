import React from 'react';

export const AppContext = React.createContext<{
  collapsed: boolean;
  setCollapsed:(value: boolean) => void;
  getPopupContainer: () => HTMLElement;
}>({
      collapsed: false,
      setCollapsed: () => {},
      getPopupContainer: () => document.body,
    });
