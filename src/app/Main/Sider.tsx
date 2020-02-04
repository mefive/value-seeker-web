import React from 'react';
import _ from 'lodash';
import { Icon, Menu } from 'antd';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { AppContext } from '../contexts';
import Portal from '../../components/Portal';
import { px, spacing } from '../style/utils';
import { Menu as MenuEntity, menus } from '../config/menus';
import { basename } from '../config/constants';
import { findTreeNode } from '../../utils/tree';

function renderMenus(list: MenuEntity[]) {
  return list.map(({ code, url, title, icon, children }) => {
    const text = (
      <>
        {icon && (
          // @ts-ignore
          <Icon type={icon} className="anticon" />
        )}

        <span>{title}</span>
      </>
    );

    const prefix = new RegExp(`^${basename}`);

    const node = url ? (
      <>
        {prefix.test(url) ? (
          <NavLink to={url.replace(prefix, '')}>{text}</NavLink>
        ) : (
          <a href={url}>{text}</a>
        )}
      </>
    ) : (
      text
    );

    if (children == null || children.length === 0) {
      return <Menu.Item key={code}>{node}</Menu.Item>;
    }

    return (
      <Menu.SubMenu key={code} title={node}>
        {renderMenus(children)}
      </Menu.SubMenu>
    );
  });
}

function Sider(props: RouteComponentProps) {
  const {
    location: { pathname },
  } = props;
  const { collapsed } = React.useContext(AppContext);
  const width = collapsed ? 80 : 256;

  const current = React.useMemo<MenuEntity>(
    () => findTreeNode(menus, 'url', pathname),
    [pathname],
  );

  const [openKeys, setOpenKeys] = React.useState(
    current ? current.pathname.split(',') : [],
  );

  React.useEffect(
    () =>
      setOpenKeys(
        _.uniq([...openKeys, ...(current ? current.pathname.split(',') : [])]),
      ),
    [current],
  );

  return (
    <>
      <div
        css={`
          width: ${width}px;
          height: 1px;
        `}
      />

      <Portal>
        <div
          css={`
            background: #00152a;
            position: fixed;
            top: 0;
            bottom: 0;
            z-index: 1;
            width: ${width}px;
            color: #fff;
            box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
            transition: all 0.35s;
          `}
        >
          <div
            css={`
              line-height: ${spacing(8)}px;
              ${px(3)};
              font-size: 20px;
              text-align: center;
              overflow: hidden;
              white-space: nowrap;
            `}
          >
            {collapsed ? 'V' : 'Value Seeker'}
          </div>

          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={current ? [current.code] : []}
            defaultOpenKeys={collapsed ? [] : openKeys}
            key={openKeys.toString()}
            inlineIndent={32}
            inlineCollapsed={collapsed}
          >
            {renderMenus(menus)}
          </Menu>
        </div>
      </Portal>
    </>
  );
}

export default withRouter(Sider);
