const NotificationMxn = {
  methods: {
    doNotification(level, title, message) {
      const notification = {
        title,
        level,
        message,
      };
      this.displayNotification(notification);
    },
    displayNotification(notification) {
      if (notification.level === 0) {
        // success
        this.$notify.info({
          title: notification.title,
          message: notification.message,
          offset: 20,
          duration: 5000,
        });
      } else if (notification.level === 1) {
        // success
        this.$notify({
          type: 'success',
          title: notification.title,
          message: notification.message,
          offset: 20,
          duration: 5000,
        });
      } else if (notification.level === 2) {
        // warning
        this.$notify({
          title: notification.title,
          message: notification.message,
          type: 'warning',
          offset: 20,
          duration: 5000,
        });
      } else if (notification.level === 3) {
        // error
        this.$notify({
          title: notification.title,
          message: notification.message,
          type: 'error',
          offset: 20,
          duration: 5000,
        });
      } else {
        // eslint-disable-next-line no-lonely-if
        if (notification.title !== '' || notification.message !== '') {
          this.$notify({
            title: notification.title,
            message: notification.message,
            offset: 20,
            duration: 5000,
          });
        }
      }
    },
  },
};
export default NotificationMxn;
