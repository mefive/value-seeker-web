import { css } from 'styled-components';

const globalStyle = css`
  body {
    min-width: ${props => props.theme.bodyMinWidth}px;
  }
 
  //* {
  //  &::-webkit-scrollbar {
  //    width: 6px;
  //    height: 8px;
  //  }
  //  &::-webkit-scrollbar-thumb {
  //    background-color: #d0d0d7;
  //  }
  //  &::-webkit-scrollbar-track {
  //    background: #f4f4f8; 
  //  }
  //}

  // table 
  .ant-table-body {
    overflow-x: auto;
  }
  .ant-table-thead > tr > th {
    white-space: nowrap; 
    line-height: 1em; 
  }
  .ant-table-small {
    border: none !important;
    
    .ant-table-thead {
      transition: opacity .2s;

      tr {
        background-color: #fafafa !important;
      }
    }
    
    .ant-table-content {
      .ant-table-body {
        margin: 0;
      }
    }
  }
  
  // modal
  .ant-modal-content {
    border-radius: 8px;
  }
  
  .ant-modal-header {
    border-bottom: none;
    padding-top: 32px;
    padding-bottom: 0;
    border-radius: 8px 8px 0 0;
    
    .ant-modal-title {
      text-align: center;
      font-size: 18px;
      font-weight: 600;
    }
  }
  
  .ant-modal-footer {
    text-align: center;
    padding-bottom: 32px;
    border-top: none;
    padding-top: 0;
    border-radius: 0 0 8px 8px;
  }

  .ant-select-tree-dropdown {
    max-height: 40vh!important;
  }
`;

export default globalStyle;
