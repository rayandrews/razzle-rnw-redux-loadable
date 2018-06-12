import express from 'express';
import qs from 'qs';

import App from 'App';
import configureStore from 'App/store/configureStore';
import { fetchCounter } from 'App/api/counter';

import Html from './Html';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    fetchCounter((apiResult) => {
      const params = qs.parse(req.query);
      const counter = parseInt(params.counter, 10) || apiResult || 0;

      // Compile an initial state
      const preloadedState = { counter };

      // Create a new Redux store instance
      const store = configureStore(preloadedState);

      new Html({
        assets,
        store,
        AppComponent: App,
        response: res,
        request: req,
      }).render();
    });
  });

export default server;
