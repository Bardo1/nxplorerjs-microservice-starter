import './common/env';
import Server from './common/server';
import { ApolloServer } from 'apollo-server-express';
import { configHystrix, configGraphQL } from '../server/common/config';
import * as cluster from 'cluster';
import * as os from 'os';
import * as http from 'http';

// Single Node execution
// tslint:disable:no-console
const welcome = port =>
  console.log(
    `up and running in ${process.env.NODE_ENV ||
      'development'} @: ${os.hostname()} on port: ${port}`
  );

const setupServer = () => {
  // create server
  const app = new Server().getServer().build();
  const apolloServer: ApolloServer = configGraphQL(app);
  // Create Server so that it can be reused for the
  // configuring the SubscriptionServer
  const ws = http.createServer(app);

  if (process.env.GRAPHQL_SUBSCRIPTIONS === 'true') {
    apolloServer.installSubscriptionHandlers(ws);
  }
  // console.log(apolloServer.subscriptionsPath);
  ws.listen(process.env.PORT, err => {
    if (err) {
      throw new Error(err);
    }

    if (process.env.STREAM_HYSTRIX === 'true') {
      // configure Hystrix Support
      configHystrix();
    }

    welcome(process.env.PORT);
  });
};

const setupCluster = () => {
  const numWorkers = require('os').cpus().length;

  console.log('Master cluster setting up ' + numWorkers + ' workers...');

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('online', worker => {
    console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      'Worker ' +
        worker.process.pid +
        ' died with code: ' +
        code +
        ', and signal: ' +
        signal
    );
    console.log('Starting a new worker');
    cluster.fork();
  });
};

// Run in cluster mode
if (process.env.CLUSTER_MODE === 'true' && cluster.isMaster) {
  setupCluster();
} else {
  setupServer();
}
