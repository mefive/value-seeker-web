import { injectable } from 'inversify';
import _ from 'lodash';
import { action, observable } from 'mobx';
import { Notification } from '../entities';
import { NotificationType } from '../enums';

@injectable()
class NotificationStore {
  @observable notifications: Notification[] = [];

  @action('PUSH')
  push(type: NotificationType, message: string) {
    this.notifications.push({
      id: _.uniqueId(),
      type,
      message,
    });
  }

  @action('REMOVE')
  remove(notification: Notification) {
    const { id } = notification;
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications.splice(index, 1);
    }
  }

  @action('SUCCESS')
  success(message: string) {
    this.push(NotificationType.SUCCESS, message);
  }

  @action('INFO')
  info(message: string) {
    this.push(NotificationType.INFO, message);
  }

  @action('ERROR')
  error(message: string) {
    this.push(NotificationType.ERROR, message);
  }
}

export default NotificationStore;
