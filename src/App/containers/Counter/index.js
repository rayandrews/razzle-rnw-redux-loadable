import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Counter } from 'components';
import * as CounterActions from 'actions/counter';
import { getCounter } from 'selectors/counter';

const CounterWrapped = connect(
  (state) => ({
    counter: getCounter(state),
  }),
  (dispatch) => bindActionCreators(CounterActions, dispatch)
)(Counter);

CounterWrapped.fetchData = (store) => {
  if (__CLIENT__) return [];

  const promises = [];
  promises.push(store.dispatch(CounterActions.getCounter()));
  return Promise.all(promises);
};

export default CounterWrapped;
