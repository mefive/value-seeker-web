import { Market, NotificationType } from './enums';

export interface Notification {
  message: string;
  type: NotificationType;
  id?: string;
}

interface Basic {
  id: string;
  name: string;
  tsCode: string;
  listDate: string;
  startDate: string;
  endDate: string;
}

export interface StockBasic extends Basic {
  industry: string;
}

export interface IndexBasic extends Basic {
  market: Market;
}
