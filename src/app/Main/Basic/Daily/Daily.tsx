import { Divider } from 'antd';
import { MobXProviderContext, Observer } from 'mobx-react';
import React from 'react';
import { Block } from '../../../components/layout';
import { Query, QueryItem } from '../../../components/query';
import { ClickableText } from '../../../components/text';
import { AssetType } from '../../../enums';
import language from '../../../language';
import { bold, m, mb } from '../../../style/utils';
import BasicStore from '../BasicStore';
import DailyChart from './DailyChart';
import DailyStore from './DailyStore';

function Daily() {
  const { dailyStore, basicStore } = React.useContext<{
    dailyStore: DailyStore;
    basicStore: BasicStore;
  }>(MobXProviderContext);

  React.useEffect(() => {
    dailyStore.load(basicStore.dailyBasic.tsCode);
    return () => {
      dailyStore.clear();
    };
  }, []);

  return (
    <div css={m(3)}>
      <Observer>
        {() => {
          const basic = basicStore.dailyBasic;
          const { query } = basicStore;

          return (
            <Block>
              <div
                css={`
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  ${mb(3)}
                  ${bold}
                `}
              >
                <div css="font-size: 16px">
                  {basic.name} {basic.tsCode}
                </div>
                <ClickableText onClick={() => basicStore.closeDaily()}>
                  返回列表
                </ClickableText>
              </div>

              <Query>
                <QueryItem
                  label="类型"
                  control={language.assetType[query.assetType]}
                />

                <QueryItem
                  label="市场"
                  control={
                    query.assetType === AssetType.STOCK
                      ? basic.market
                      : language.market[basic.market]
                  }
                />

                <QueryItem label="上市时间" control={basic.listDate} />

                <QueryItem
                  label="交易区间"
                  control={`${basic.startDate} ~ ${basic.endDate}`}
                />

                {query.assetType === AssetType.STOCK && (
                  <>
                    <QueryItem label="所属行业" control={basic.industry} />

                    <QueryItem label="所属地区" control={basic.area} />
                  </>
                )}

                {query.assetType === AssetType.INDEX && (
                  <>
                    <QueryItem label="发布商" control={basic.publisher} />

                    <QueryItem label="指数类别" control={basic.category} />
                  </>
                )}
              </Query>

              <Divider />

              <DailyChart />
            </Block>
          );
        }}
      </Observer>
    </div>
  );
}

export default Daily;
