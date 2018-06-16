import 'cross-fetch/polyfill';

import express from 'express';
import logger from 'morgan';

import { matchPath } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import { AppRegistry } from 'react-native';
import { getBundles } from 'react-loadable/webpack';

import qs from 'qs';
import serialize from 'serialize-javascript';

import App from 'app';
import AppRoutes from 'app/routes';

import configureStore from 'store/configureStore';
import { fetchCounter } from 'api/counter';

// eslint-disable-next-line
import stats from 'build/react-loadable.json';

import AppWrapper from './AppWrapper';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const server = express();

server.use(logger('combined'));

server.get('/api/counter', (req, res) => {
  fetchCounter((result) => {
    const params = qs.parse(req.query);
    const counter = parseInt(params.counter, 10) || result || 0;

    res.json({
      counter,
    });
  });
});

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    /* Initializing redux store based on fetch data */
    const store = configureStore();

    const promises = AppRoutes.reduce((acc, route) => {
      if (
        matchPath(req.path, route) &&
        route.component &&
        route.component.preload
      ) {
        acc.push(
          route.component
            .preload()
            .then((comp) =>
              comp.default.fetchData(store, req.params, req.query)
            )
        );
      }

      return acc;
    }, []);
    /* end of redux store */

    Promise.all(promises)
      .then(() => {
        const finalState = store.getState();

        const context = {};
        const modules = [];

        AppRegistry.registerComponent('App', () =>
          AppWrapper({
            context,
            store,
            url: req.url,
            modules,
            Component: App,
          })
        );

        const { element, getStyleElement } = AppRegistry.getApplication(
          'App',
          {}
        );

        const html = ReactDOMServer.renderToString(element);
        const css = ReactDOMServer.renderToStaticMarkup(getStyleElement());

        if (context.url) {
          res.redirect(context.url);
        } else {
          const bundles = getBundles(stats, modules);
          const chunks = bundles.filter((bundle) =>
            bundle.file.endsWith('.js')
          );

          /* eslint-disable */
          res.status(200).send(
            `<!doctype html>
<html lang="">
  <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet='utf-8' />
      <title>Welcome to Razzle</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${css}
      ${
        assets.client.css
          ? `<link rel="stylesheet" href="${assets.client.css}">`
          : ''
      }
  </head>
  <body>
    <div id="root">${html}</div>
    <script>
  window.__PRELOADED_STATE__ = ${serialize(finalState)};
</script>
    ${
      process.env.NODE_ENV === 'production'
        ? `<script src="${assets.client.js}"></script>`
        : `<script src="${assets.client.js}" crossorigin></script>`
    }
    ${chunks
      .map(
        (chunk) =>
          process.env.NODE_ENV === 'production'
            ? `<script src="/${chunk.file}"></script>`
            : `<script src="http://${process.env.HOST}:${parseInt(
                process.env.PORT,
                10
              ) + 1}/${chunk.file}"></script>`
      )
      .join('\n')}
    <script>
  window.main();
</script>
  </body>
</html>`
          );
          /** eslint-enable */
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error');
      });
  });

export default server;
