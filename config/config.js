const config = {
  development: {
    redis: {
      port: 6379,
      host: '127.0.0.1',
      timeout: 1,
      scheme: 'tcp',
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
  },
};
module.exports = config;
