import React from 'react';
import { Provider } from 'react-redux';
import BrowserRouter from 'react-router-dom/BrowserRouter';

import App from './App';

/* eslint-disable */
import configureStore from 'store/configureStore';
const store = configureStore(window.__PRELOADED_STATE__ || {});
/* eslint-enable */

const AppWrapper = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

export default AppWrapper;
