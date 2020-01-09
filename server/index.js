/**
 * Start the server side Node APM agent before any other modules are loaded.
 * This sets it up to auto instrument the express server.
 *
 * We use the express server instead of the default Nuxt server because the APM
 * agent supports its auto-instrumentation, meaning less work for us.
 *
 * See https://www.elastic.co/guide/en/apm/agent/nodejs/master/express.html
 *
 * @type {Agent}
 */
const apm = require('elastic-apm-node/start');
const express = require('express');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');

const app = express();

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');

config.dev = process.env.NODE_ENV !== 'production';

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
  }

  /**
   * Since there are no routes set up using express Router, we need to tell the
   * APM agent the name of each transaction that it captures. We do that via
   * this middleware, deliberately added before the nuxt middleware.
   */
  app.use((req, res, next) => {
    apm.setTransactionName(req.path);
    next();
  });

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
}

start();
