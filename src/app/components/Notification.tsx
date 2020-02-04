import { notification } from 'antd';
import _ from 'lodash';
import { autorun, toJS } from 'mobx';
import { MobXProviderContext } from 'mobx-react';
import React from 'react';
import { Notification as NotificationEntity } from '../entities';
import language from '../language';
import NotificationStore from '../store/NotificationStore';

function Notification() {
  const { notificationStore } = React.useContext<{
    notificationStore: NotificationStore;
  }>(MobXProviderContext);

  const [notifications, setNotifications] = React.useState<NotificationEntity[]>(
    toJS(notificationStore.notifications),
  );

  React.useEffect(() => autorun(() => {
    const add = _.differenceBy(notificationStore.notifications, notifications);

    add.forEach(n => notification[n.type]({
      message: language.notificationType[n.type],
      description: (
        <div>
          {n.message.split('\r\n')
            .map((msg, index) => (<div key={`${index + 1}`}>{msg}</div>))}
        </div>
      ),
      // duration: null,
      key: n.id,
      onClose: () => notificationStore.remove(n),
    }));

    setNotifications(toJS(notificationStore.notifications));
  }), []);

  return <></>;
}

export default Notification;
