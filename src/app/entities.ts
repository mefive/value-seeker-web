import { Market, NotificationType } from './enums';

export interface Notification {
  message: string;
  type: NotificationType;
  id?: string;
}

interface BaseBasic {
  id: string;
  name: string;
  tsCode: string;
  listDate: string;
  startDate: string;
  endDate: string;
}

export interface StockBasic extends BaseBasic {
  industry: string;
  area: string;
  market?: string;
}

export interface IndexBasic extends BaseBasic {
  market: Market;
  publisher?: string;
  category?: string;
}

interface BaseDaily {
  tsCode: string;
  tradeDate: string;
}

export interface Daily extends BaseDaily {
  open: number;
  close: number;
  high: number;
  low: number;
  vol: number;
  k: number;
  d: number;
  j: number;
}

export interface DailyBasic extends BaseDaily {
  peTtm: number;
  pb: number;
  psTtm: number;
  dvTtm: number;
}
