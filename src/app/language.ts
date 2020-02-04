import { AssetType, Market, NotificationType, StockListStatus } from './enums';

export default {
  notificationType: {
    [NotificationType.SUCCESS]: '成功',
    [NotificationType.INFO]: '通知',
    [NotificationType.ERROR]: '错误',
  },
  assetType: {
    [AssetType.INDEX]: '指数',
    [AssetType.STOCK]: '股票',
  },
  stockListStatus: {
    [StockListStatus.DOWN]: '已退市',
    [StockListStatus.LIST]: '在市',
    [StockListStatus.PAUSE]: '停牌',
  },
  market: {
    [Market.MSCI]: 'MSCI指数',
    [Market.CSI]: '中证指数',
    [Market.SSE]: '上交所指数',
    [Market.SZSE]: '深交所指数',
    [Market.CICC]: '中金所指数',
    [Market.SW]: '申万指数',
    [Market.OTH]: '其他指数',
  },
};
