import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import configureStore from 'store/configureStore';
import App from 'app';

/* eslint-disable */
const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);
delete window.__PRELOADED_STATE__;
/* eslint-enable */

const AppWrapper = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

export default AppWrapper;
