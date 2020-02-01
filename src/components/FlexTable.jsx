import { Icon, Spin } from 'antd';
import setStyle from 'dom-helpers/style';
import setScrollLeft from 'dom-helpers/query/scrollLeft';
import _ from 'lodash';
import memoize from 'memoize-one';
import * as PropTypes from 'prop-types';
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import ResizeObserver from 'resize-observer-polyfill';
import styled, { css } from 'styled-components';
import { palette } from '../app/style/utils';
import Central from './Central';

const createItemData = memoize((dataSource, expandedRowKeys, rowKey) => {
  const itemData = [];

  const walk = (nodes, level = 0) => {
    nodes.forEach(node => {
      itemData.push({
        ..._.omit(node, ['children']),
        level,
        children: node.children,
      });

      if (node.children && expandedRowKeys.includes(node[rowKey])) {
        walk(node.children, level + 1);
      }
    });
  };

  if (dataSource != null) {
    walk(dataSource);
  }

  return itemData;
});

class FlexTable extends React.PureComponent {
  innerList = React.createRef();

  list = React.createRef();

  head = React.createRef();

  fixedList = React.createRef();

  state = {
    scrollbarWidth: 0,
    scrollbarHeight: 0,
    scrolled: false,
    rowWidth: '100%',
    fixedColumnWidth: 0,
  };

  componentDidMount() {
    const { scroll } = this.props;

    if (_.get(scroll, 'y') != null) {
      const { current: innerList } = this.innerList;
      const { parentNode: list } = innerList;

      this.observer = new ResizeObserver(this.onTableSizeChange);
      this.observer.observe(innerList);

      list.addEventListener('scroll', this.onScroll);
      setTimeout(() => this.onTableSizeChange(), 50);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { columns, useWindow } = this.props;

    if (columns !== nextProps.columns && useWindow) {
      this.setState({ rowWidth: 0 }, this.adjustRowWidth);
    }
  }

  componentWillUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }

    const { current: innerList } = this.innerList;
    const { parentNode: list } = innerList;

    list.removeEventListener('scroll', this.onScroll);
  }

  onScroll =() => {
    const { innerList, head, fixedList } = this;
    const { current: list } = innerList;
    const { scrollLeft, scrollTop } = list.parentNode;

    setStyle(head.current, 'transform', `translateX(-${scrollLeft}px)`);

    if (fixedList.current) {
      fixedList.current.parentNode.scrollTo(0, scrollTop);
    }

    this.setState({ scrolled: scrollLeft > 0 });
  };

  onTableSizeChange = () => {
    const { innerList: { current: list } } = this;

    if (list) {
      const parent = list.parentNode;
      this.setState({
        scrollbarWidth: parent.offsetWidth - parent.clientWidth,
        scrollbarHeight: parent.offsetHeight - parent.clientHeight,
        rowWidth: 0,
      }, this.adjustRowWidth);
    }
  };

  adjustRowWidth = () => {
    const { head: { current: head } } = this;
    const { fixedColumnCount } = this.props;

    let rowWidth = 0;
    let fixedColumnWidth = 0;

    if (head) {
      const cells = head.querySelectorAll('div[class^="FlexTable__TableCell"]');
      const reducer = (p, c) => p + c.offsetWidth;
      rowWidth = [].reduce.call(cells, reducer, 0);
      const fixed = [].slice.call(cells, 0, fixedColumnCount);
      fixedColumnWidth = [].reduce.call(fixed, reducer, 0);
    }

    this.setState({ rowWidth, fixedColumnWidth });
  };

  onExpand = record => {
    const { rowKey, onExpandedRowsChange } = this.props;
    let { expandedRowKeys } = this.props;
    const key = record[rowKey];
    const index = expandedRowKeys.indexOf(key);
    expandedRowKeys = expandedRowKeys.slice();
    if (index === -1) {
      expandedRowKeys.push(key);
    } else {
      expandedRowKeys.splice(index, 1);
    }
    onExpandedRowsChange(expandedRowKeys);
  };

  clearScrollLeft = () => {
    const { current: list } = this.innerList;
    setScrollLeft(list.parentNode, 0);
  };

  scrollToItem(key, align = 'smart') {
    const { dataSource, expandedRowKeys, rowKey } = this.props;
    const { list: { current: list } } = this;

    const itemData = createItemData(dataSource, expandedRowKeys, rowKey);

    if (list) {
      const index = itemData.findIndex(record => record[rowKey] === key);

      if (index !== -1) {
        list.scrollToItem(index, align);
      }
    }
  }

  scrollToIndex(index, align = 'smart') {
    const { list: { current: list } } = this;
    if (list) {
      list.scrollToItem(index, align);
    }
  }

  renderTableHead = (column, colIndex) => {
    const {
      dataIndex, key, title, width, align, className, minWidth, onHead, onSort,
    } = column;

    const { components, sortInfo } = this.props;

    const sortOrder = sortInfo && [key, dataIndex].includes(sortInfo.key) ? sortInfo.order : null;

    const props = {
      key: dataIndex || key,
      width,
      minWidth,
      align,
      className,
      onClick: onSort ? () => {
        let order = null;

        if (sortOrder === 'ascend') {
          order = 'descend';
        } else if (sortOrder == null) {
          order = 'ascend';
        }

        onSort(order);
      } : null,
    };

    const headContent = _.isFunction(title) ? title(column) : title;

    const customHead = _.get(components, 'head.cell');

    if (customHead) {
      const headProps = (_.isFunction(onHead) ? onHead() : {});
      return React.createElement(customHead, { ...props, ...headProps, colIndex }, headContent);
    }


    return (
      <TableCell
        {...props}
        css={onSort ? css`cursor: pointer` : undefined}
      >
        {!onSort
          ? headContent
          : (
            <div css="display: flex;align-items: center">
              {headContent}
              <div
                css={`
                  i {
                    display: block;
                    font-size: 12px;
                    height: 0.5em;
                    transform: scale(0.9) translateY(-3px);
                  }
                  margin-left: 4px;
                `}
              >
                <Icon
                  type="caret-up"
                  css={sortOrder === 'ascend' ? css`color: ${palette('primary')}` : undefined}
                />
                <Icon
                  type="caret-down"
                  css={sortOrder === 'descend' ? css`color: ${palette('primary')}` : undefined}
                />
              </div>
            </div>
          )}
      </TableCell>
    );
  };

  renderTableBodyCell(record, rowIndex, column, colIndex) {
    const {
      dataIndex, key, render, onCell, width, align, className, minWidth,
    } = column;

    const {
      indentSize, expandedRowKeys, rowKey, expandIcon, components, expandIndex,
    } = this.props;

    const text = _.get(record, dataIndex);

    const props = {
      key: dataIndex || key,
      width,
      minWidth,
      align,
      className,
    };

    const expanded = expandedRowKeys.includes(record[rowKey]);
    const { onExpand } = this;

    const hasChildren = record.children != null && record.children.length > 0;
    const iconVisibility = hasChildren ? 'visible' : 'hidden';

    const cellText = (
      <>
        {colIndex === expandIndex && (
          <>
            <div style={{ display: 'inline-block', width: record.level * indentSize }} />

            {record.children !== undefined && (
              <>
                {_.isFunction(expandIcon)
                  ? expandIcon({
                    expanded, onExpand, record,
                  })
                  : (
                    <ExpandIcon
                      onClick={e => {
                        if (hasChildren) {
                          e.stopPropagation();
                          onExpand(record, e);
                        }
                      }}
                      style={{ visibility: iconVisibility }}
                    >
                      {expanded ? '-' : '+'}
                    </ExpandIcon>
                  )}
              </>
            )}
          </>
        )}

        {_.isFunction(render) ? render(text, record, rowIndex) : text}
      </>
    );

    const customBodyCell = _.get(components, 'body.cell');

    if (customBodyCell) {
      const cellProps = (_.isFunction(onCell) ? onCell(record, rowIndex, colIndex) : {});

      return React.createElement(customBodyCell, { ...props, ...cellProps, colIndex }, cellText);
    }

    return (
      <TableCell {...props}>
        {cellText}
      </TableCell>
    );
  }

  renderRow = ({ data, index, style }) => {
    const {
      rowKey, columns, onRow, components,
    } = this.props;

    const {
      rowWidth,
    } = this.state;

    const record = data[index];

    let rowProps = {
      key: record[rowKey],
      'data-key': record[rowKey],
      style: {
        ...style,
        width: rowWidth,
      },
    };

    const cells = columns.map(
      (column, colIndex) => this.renderTableBodyCell(record, index, column, colIndex),
    );

    const customBodyRow = _.get(components, 'body.row');

    if (customBodyRow) {
      if (_.isFunction(onRow)) {
        rowProps = {
          ...rowProps,
          ...onRow(record, index),
        };
      }

      return React.createElement(customBodyRow, { ...rowProps }, cells);
    }

    return (
      <TableRow {...rowProps}>
        {cells}
      </TableRow>
    );
  };

  renderTable({
    scrollbarWidth = null,
    columns,
    rowWidth,
    bodyCss = null,
    height,
    headRef = null,
    listRef = null,
    innerListRef = null,
  }) {
    const {
      dataSource, expandedRowKeys, rowKey, itemSize, additions, useWindow,
    } = this.props;

    const itemData = createItemData(
      dataSource, expandedRowKeys, rowKey, rowWidth, ...(additions || []),
    );

    return (
      <>
        <TableHead style={{ paddingRight: scrollbarWidth }}>
          <TableRow
            style={{
              width: rowWidth,
            }}
            ref={headRef}
          >
            {columns.map(this.renderTableHead)}
          </TableRow>
        </TableHead>

        {useWindow && (
          <TableBody css={bodyCss}>
            <List
              height={height}
              itemCount={itemData.length}
              itemData={itemData}
              itemSize={itemSize}
              ref={listRef}
              innerRef={innerListRef}
            >
              {this.renderRow}
            </List>
          </TableBody>
        )}

        {!useWindow && (() => {
          const tableBody = (
            <TableBody ref={this.innerList}>
              {itemData.map((row, index) => this.renderRow({
                data: itemData,
                index,
                style: {},
              }))}
            </TableBody>
          );

          if (height == null) {
            return tableBody;
          }

          return (
            <ScrollContainer height={height}>
              {tableBody}
            </ScrollContainer>
          );
        })()}
      </>
    );
  }

  render() {
    const {
      loading, className, scroll, columns, fixedColumnCount,
    } = this.props;

    const height = _.get(scroll, 'y');

    const {
      scrollbarWidth, rowWidth, fixedColumnWidth, scrollbarHeight, scrolled,
    } = this.state;

    return (
      <div className={className}>
        <Table>
          {this.renderTable({
            scrollbarWidth,
            rowWidth,
            columns,
            headRef: this.head,
            listRef: this.list,
            innerListRef: this.innerList,
            height,
          })}

          {(fixedColumnWidth > 0 && scrolled) && (
            <FixedColumnContainer
              style={{
                width: fixedColumnWidth,
                bottom: scrollbarHeight,
              }}
              scrolled={scrolled}
            >
              {this.renderTable({
                columns: columns.slice(0, fixedColumnCount),
                rowWidth: fixedColumnWidth,
                innerListRef: this.fixedList,
                height: height - scrollbarHeight,
                bodyCss: css`
                  > div {
                    overflow: hidden !important;
                    background-color: #fff;
                  }
                `,
              })}
            </FixedColumnContainer>
          )}

          {loading && (
            <Loading height={height}>
              {typeof loading === 'boolean'
                ? (
                  <Central>
                    <Spin />
                  </Central>
                ) : loading}
            </Loading>
          )}
        </Table>
      </div>
    );
  }
}

FlexTable.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.shape({
    dataIndex: PropTypes.string,
    key: PropTypes.string,
    title: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
      PropTypes.string,
    ]),
    onCell: PropTypes.func,
    onHead: PropTypes.func,
    width: PropTypes.number,
    minWidth: PropTypes.number,
    className: PropTypes.string,
    align: PropTypes.string,
    render: PropTypes.func,
    sorter: PropTypes.func,
  })).isRequired,
  dataSource: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      wrapper: PropTypes.node,
      spinning: PropTypes.bool,
    }),
  ]),
  rowKey: PropTypes.string.isRequired,
  expandedRowKeys: PropTypes.arrayOf(PropTypes.string),
  onExpandedRowsChange: PropTypes.func,
  expandIcon: PropTypes.elementType,
  expandIndex: PropTypes.number,
  onRow: PropTypes.func,
  indentSize: PropTypes.number,
  components: PropTypes.shape({
    body: PropTypes.shape({
      cell: PropTypes.elementType,
      row: PropTypes.elementType,
    }),
    head: PropTypes.shape({
      cell: PropTypes.elementType,
      row: PropTypes.elementType,
    }),
  }),
  scroll: PropTypes.shape({
    y: PropTypes.number,
  }),
  itemSize: PropTypes.number,
  additions: PropTypes.oneOfType([PropTypes.any]),
  useWindow: PropTypes.bool,
  fixedColumnCount: PropTypes.number,
  sortInfo: PropTypes.shape({
    key: PropTypes.string,
    order: PropTypes.string,
  }),
};

FlexTable.defaultProps = {
  className: null,
  dataSource: null,
  loading: false,
  expandedRowKeys: [],
  onExpandedRowsChange: null,
  expandIcon: null,
  expandIndex: 0,
  onRow: null,
  components: null,
  indentSize: 15,
  scroll: null,
  itemSize: 37,
  additions: null,
  useWindow: false,
  fixedColumnCount: 0,
  sortInfo: null,
};

export default FlexTable;

const TableCell = styled.div`${props => css`
  padding: 8px;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  ${props.align && css`text-align: ${props.align}`};
  flex-grow: ${props.width == null ? 1 : 0};
  flex-shrink: 0;
  ${(props.width || props.minWidth) && css`
    flex-basis: ${props.width || props.minWidth}px;
  `}
  ${props.width && css`width: ${props.width}px;`}
`}`;

const TableRow = styled.div`
  display: flex;
  align-items: stretch;
  min-width: 100%;
`;

const TableHead = styled.div`
  position: relative;
  overflow: hidden;
`;

const TableBody = styled.div`
  position: relative;
`;

const Loading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, ${props => (props.transparent ? '0' : '0.8')});
`;

const Table = styled.div`
  position: relative;
  background-color: #fff;
`;

const ExpandIcon = styled.div`
  display: inline-block;
  margin-right: 4px;
  cursor: pointer;
`;

const ScrollContainer = styled.div`
  height: ${props => props.height}px;
  overflow-y: auto;
`;

const FixedColumnContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  ${props => props.scrolled && css`
    box-shadow: 2px 0 4px 0 rgba(0, 0, 0, 0.08);
  `}
`;

FlexTable.Table = Table;
FlexTable.TableCell = TableCell;
FlexTable.TableHead = TableHead;
FlexTable.TableBody = TableBody;
FlexTable.TableRow = TableRow;
FlexTable.ScrollContainer = ScrollContainer;
