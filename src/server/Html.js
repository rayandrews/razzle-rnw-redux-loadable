import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { getBundles } from 'react-loadable/webpack';
import { AppRegistry } from 'react-native';

import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Capture } from 'react-loadable';

import serialize from 'serialize-javascript';

import stats from 'build/react-loadable.json';

/* eslint-disable react/prefer-stateless-function, react/no-danger */
export default class Html {
  constructor({ AppComponent, store, url, assets, request, response }) {
    this.AppComponent = AppComponent;
    this.store = store;
    this.context = {};
    this.modules = [];
    this.url = url;
    this.assets = assets;
    this.request = request;
    this.response = response;

    return this.render();
  }

  reactComponent = () => () => {
    const { AppComponent, modules, context, request, store } = this;

    return (
      <Capture report={(moduleName) => modules.push(moduleName)}>
        <Provider store={store}>
          <StaticRouter context={context} location={request.url}>
            <AppComponent />
          </StaticRouter>
        </Provider>
      </Capture>
    );
  };

  render() {
    const { assets, store, response, context, modules } = this;

    AppRegistry.registerComponent('App', this.reactComponent);

    const { element, getStyleElement } = AppRegistry.getApplication('App', {});
    const html = ReactDOMServer.renderToString(element);
    const css = ReactDOMServer.renderToStaticMarkup(getStyleElement());

    const reduxState = store.getState();

    if (context.url) {
      response.redirect(context.url);
    } else {
      const chunks = getBundles(stats, modules).filter((bundle) =>
        bundle.file.endsWith('.js')
      );

      /* eslint-disable */
      response.status(200).send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta charSet="utf-8" />
    <title>Welcome to Razzle</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${css}
  </head>
  <body>
    <div id="root">${html}</div>
    <script>
  window.__PRELOADED_STATE__ = ${serialize(reduxState)};
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
            ) + 1}/${chunk.file}" crossorigin></script>`
    )
    .join('\n')}
  <script>
    window.main();
</script>
  </body>
</html>`);
      /* eslint-enable */
    }
  }
}
