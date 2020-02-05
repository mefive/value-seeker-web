import axios from 'axios';
import { injectable } from 'inversify';
import { action, observable } from 'mobx';
import { task } from 'mobx-task';
import { Daily, DailyBasic } from '../../../entities';

@injectable()
class DailyStore {
  @observable.ref dailyList: Daily[] = [];

  @observable.ref dailyBasicList: DailyBasic[] = [];

  load = task(
    action('LOAD', async (tsCode: string) => {
      const responses = await Promise.all([
        axios.get<Daily[]>('/api/daily', { params: { tsCode } }),
        axios.get<DailyBasic[]>('/api/daily-basic', { params: { tsCode } }),
      ]);

      const dailyResponse = responses[0];
      const dailyBasicResponse = responses[1];

      action('LOAD_DONE', () => {
        this.dailyList = dailyResponse.data;
        this.dailyBasicList = dailyBasicResponse.data;
      }).bind(this)();
    }),
  );

  @action('CLEAR')
  clear() {
    this.dailyList = [];
    this.dailyBasicList = [];
  }
}

export default DailyStore;
