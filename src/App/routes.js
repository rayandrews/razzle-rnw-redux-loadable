import { Home, Counter } from './containers';

export default [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/counter',
    component: Counter,
  },
];
