const config = {
  development: {
    redis: {
      port: 6379,
      host: '127.0.0.1',
      timeout: 1,
      scheme: 'tcp',
    },
    rabbitMQ: {
      url: 'wss://rabbitmqtest.sendyit.com:8443/ws?apikey=',
      username: 'staging',
      password: '0FAHmQQmjfsIXdro',
    },
  },
  testing: {
    redis: {
      port: 6379,
      host: 'back-redis.default',
      password: '1jvkz6knyvxugixyjz4z',
      timeout: 1,
      scheme: 'tcp',
      database: 4,
    },
    rabbitMQ: {
      url: 'wss://rabbitmqtest.sendyit.com:8443/ws?apikey=',
      username: 'staging',
      password: '0FAHmQQmjfsIXdro',
    },
  },
  beta: {
    redis: {
      port: 6379,
      host: 'prod-redis.sendyit.com',
      password: 'm34s-Y8BC-mcm3-0kIU',
      timeout: 1,
      scheme: 'tcp',
      database: 4,
    },
    rabbitMQ: {
      url: 'wss://prod-stomp.sendyit.com:15675/ws',
      username: 'production',
      password: 'Z_EQ-T5rO-oQVx-OqL2',
    },
  },
  production: {
    redis: {
      port: 6379,
      host: 'prod-redis.sendyit.com',
      password: 'm34s-Y8BC-mcm3-0kIU',
      timeout: 1,
      scheme: 'tcp',
      database: 4,
    },
    rabbitMQ: {
      url: 'wss://prod-stomp.sendyit.com:15675/ws',
      username: 'production',
      password: 'Z_EQ-T5rO-oQVx-OqL2',
    },
  },
};
module.exports = config;
