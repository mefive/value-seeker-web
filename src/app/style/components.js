import { css } from 'styled-components';
import FlexTable from '../../components/FlexTable';
import { palette } from './utils';

export const tableCellStyle = css`
  line-height: 1em;
  padding: 16px 8px;
  border-left: 1px solid ${palette('border')};
  :first-child {
    border-left: none;
  }
`;

export const tableHeadStyle = css`
  background-color: #F9FAFC;
  
  ${FlexTable.TableCell} {
    color: ${palette('heading')};
    font-weight: 500;
  }
`;

export const tableRowStyle = css`
  border-bottom: 1px solid ${palette('border')};
`;

export const tableStyle = css`
  ${FlexTable.Table}, table {
    border: 1px solid ${palette('border')};
    border-bottom: none;
  }
  
  ${FlexTable.Table} {
    min-height: 300px
  }
  
  ${FlexTable.TableHead} {
    ${tableHeadStyle};
  }
  
  ${FlexTable.TableCell} {
   ${tableCellStyle};
  }

  ${FlexTable.TableRow} {
    ${tableRowStyle};
  }
  
  .ant-table-pagination.ant-pagination {
    margin-bottom: 0;
  }
`;
