import axios from 'axios';
import { inject, injectable } from 'inversify';
import { action, observable } from 'mobx';
import { task } from 'mobx-task';
import { Entities, PagingRequest, PagingResponse } from 'types';
import { IndexBasic, StockBasic } from '../../entities';
import { AssetType } from '../../enums';
import NotificationStore from '../../store/NotificationStore';
import { mergeEntities } from '../../utils/entity';
import { makeQueryParams, normalizePage } from '../../utils/helpers';

export interface BasicQuery extends PagingRequest {
  assetType: AssetType;
  tsCode: string | null;
}

export type Basic = StockBasic & IndexBasic;

@injectable()
class BasicStore {
  @inject(NotificationStore)
  private notificationStore: NotificationStore;

  @observable.ref ids: string[] = [];

  @observable total: number = 0;

  @observable.shallow basics: Entities<Basic> = {};

  @observable.shallow query: BasicQuery = {
    tsCode: null,
    assetType: AssetType.INDEX,
    page: 1,
    size: 10,
    search: '',
  };

  @action('FILL_BASIC')
  fillBasic(basics: Entities<Basic>) {
    mergeEntities(this.basics, basics, 'id');
  }

  fetchBasicPage = task(
    action('FETCH_BASIC', async (query: Partial<BasicQuery> = {}) => {
      const q = makeQueryParams(query, this.query, [
        'tsCode',
        'assetType',
        'page',
        'size',
        'search',
      ]);

      const basicPageResponse = await axios.get<PagingResponse<Basic>>(
        q.assetType === AssetType.INDEX
          ? '/api/index-basic'
          : '/api/stock-basic',
        {
          params: {
            tsCode: q.tsCode,
            start: (q.page - 1) * q.size,
            limit: q.size,
            search: q.search,
          },
        },
      );

      const basics = normalizePage<Basic>(basicPageResponse.data);

      action('FETCH_BASIC_PAGE_DONE', () => {
        this.fillBasic(basics.entities);
        this.ids = basics.ids;
        this.total = basics.total;
        this.query = { ...this.query, ...q };
      }).bind(this)();
    }),
  );

  updateDaily = task(
    action('UPDATE_DAILY', async (tsCode: string) => {
      const successResponse = await axios.post<string>('/api/daily/load', {
        tsCode,
        assetType: this.query.assetType,
      });
      this.notificationStore.success(successResponse.data);
      await this.fetchBasicPage();
    }),
  );
}

export default BasicStore;
