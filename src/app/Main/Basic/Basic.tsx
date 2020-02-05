import { Button, Input, Modal, Select, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { MobXProviderContext, Observer, useObserver } from 'mobx-react';
import React from 'react';

import { Block } from '../../components/layout';
import { Query, QueryItem } from '../../components/query';
import { ClickableText } from '../../components/text';
import { pagerShowTotal } from '../../config/constants';
import { AssetType, Market } from '../../enums';
import useQuery from '../../hooks/useQuery';
import language from '../../language';
import { m, ml, mr, mt, p, px } from '../../style/utils';
import BasicStore, { Basic as BasicEntity, BasicQuery } from './BasicStore';

function Basic() {
  const { basicStore } = React.useContext<{
    basicStore: BasicStore;
  }>(MobXProviderContext);

  const q = useObserver(() => basicStore.query);

  const query = useQuery<BasicQuery>(q);

  React.useEffect(() => {
    basicStore.fetchBasicPage(query.query);
  }, []);

  return (
    <div css={m(3)}>
      <Block>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            basicStore.fetchBasicPage(query.query);
          }}
        >
          <input type="submit" css="display: none" />

          <Query>
            <QueryItem
              label="类型"
              control={
                <Select css="width: 100%" {...query.bind('assetType')}>
                  {[AssetType.INDEX, AssetType.STOCK].map((t) => (
                    <Select.Option key={t} value={t}>
                      {language.assetType[t]}
                    </Select.Option>
                  ))}
                </Select>
              }
            />

            <QueryItem
              label="代码"
              control={<Input {...query.bind('tsCode')} />}
            />

            <QueryItem
              label="关键字"
              control={<Input {...query.bind('search')} />}
            />

            <QueryItem css="text-align: right">
              <Button
                type="primary"
                css={mr(1)}
                onClick={() => basicStore.fetchBasicPage(query.query)}
              >
                查询
              </Button>
              <Button
                onClick={() => {
                  if (query.dirty) {
                    query.reset(q);
                  } else {
                    basicStore.fetchBasicPage({
                      page: 1,
                      search: null,
                      tsCode: null,
                    });
                  }
                }}
              >
                重置
              </Button>
            </QueryItem>
          </Query>
        </form>
      </Block>

      <Block
        css={`
          ${p(0)};
          ${mt(3)};
        `}
      >
        <div css={p(2)}>
          <span css="font-size: 16px">
            {language.assetType[q.assetType]}列表
          </span>
        </div>
        <Observer>
          {() => {
            let columns: ColumnProps<BasicEntity>[] = [
              {
                dataIndex: 'name',
                title: '名称',
              },
              {
                dataIndex: 'tsCode',
                title: '代码',
                align: 'center',
              },
            ];

            if (q.assetType === AssetType.STOCK) {
              columns = columns.concat([
                {
                  dataIndex: 'industry',
                  title: '行业',
                },
              ]);
            } else {
              columns = columns.concat([
                {
                  dataIndex: 'market',
                  title: '市场',
                  render: (text: Market) => language.market[text],
                },
              ]);
            }

            columns = columns.concat([
              {
                dataIndex: 'listDate',
                title: '上市日期',
                align: 'center',
              },
              {
                dataIndex: 'startDate',
                title: '首交易日',
                align: 'center',
              },
              {
                dataIndex: 'endDate',
                title: '最后交易日',
                align: 'center',
              },
              {
                key: 'actions',
                title: '操作',
                align: 'center',
                render: (text, record) => (
                  <>
                    <ClickableText
                      onClick={() => {
                        Modal.confirm({
                          title: '是否更新日交易、日基本面数据？',
                          content: `${record.name} ${record.tsCode}`,
                          onOk: () => basicStore.updateDaily(record.tsCode),
                        });
                      }}
                    >
                      更新
                    </ClickableText>

                    {record.endDate != null && (
                      <ClickableText
                        css={ml(1)}
                        onClick={() => {
                          basicStore.openDaily(record);
                        }}
                      >
                        查看
                      </ClickableText>
                    )}
                  </>
                ),
              },
            ]);

            return (
              <Table<BasicEntity>
                css={`
                  .ant-table-pagination {
                    ${px(3)}
                  }
                `}
                loading={basicStore.fetchBasicPage.pending}
                rowKey="id"
                columns={columns}
                dataSource={basicStore.ids.map((id) => basicStore.basics[id])}
                pagination={{
                  current: q.page,
                  onChange: (page) => basicStore.fetchBasicPage({ page }),
                  total: basicStore.total,
                  pageSize: q.size,
                  showSizeChanger: true,
                  onShowSizeChange: (current, size) =>
                    basicStore.fetchBasicPage({ page: current, size }),
                  showTotal: pagerShowTotal,
                }}
              />
            );
          }}
        </Observer>
      </Block>
    </div>
  );
}

export default Basic;
