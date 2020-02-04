import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Icon, Layout } from 'antd';
import { AppContext } from '../contexts';
import Sider from './Sider';
import Basic from './Basic';
import useMedia from '../../lib/hooks/useMedia';

const { Header, Content, Footer } = Layout;
const breakpoint = '(min-width: 1439px)';

function Main() {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  const isWide = useMedia(breakpoint);

  React.useEffect(() => {
    setCollapsed(!isWide);
  }, [isWide]);

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
          <Layout css="min-height: 100vh">
            <Header css="background-color: white;padding: 0">
              <div
                css={`
                  font-size: 20px;
                  display: inline-block;
                  cursor: pointer;
                  i {
                    width: 64px;
                  }
                `}
                onClick={() => setCollapsed(!collapsed)}
              >
                <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
              </div>
            </Header>

            <Content>
              <Switch>
                <Route path="/basic" component={Basic} />
                <Redirect from="/" to="/basic" />
              </Switch>
            </Content>

            <Footer css="text-align: center">
              Copyright&nbsp;
              <Icon type="copyright" />
              &nbsp; {new Date().getFullYear()} Value Seeker
            </Footer>
          </Layout>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default Main;
