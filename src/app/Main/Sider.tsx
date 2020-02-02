import React from 'react';
import { AppContext } from '../contexts';
import Portal from '../../components/Portal';
import { px, spacing } from '../style/utils';

function Sider() {
  const { collapsed } = React.useContext(AppContext);
  const width = collapsed ? 80 : 256;

  return (
    <>
      <div css={`width: ${width}px;height: 1px`} />

      <Portal>
        <div
          css={`
            background: #00152A;
            position: fixed;
            top: 0;
            bottom: 0;
            z-index: 1;
            width: ${width}px;
            color: #fff;
          `}
        >
          <div
            css={`
              line-height: ${spacing(8)}px;
              ${px(3)};
              font-size: 20px;
              text-align: center;
            `}
          >
            Value Seeker
          </div>
        </div>
      </Portal>
    </>
  );
}

export default Sider;
