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
  const promises = [];

  promises.push(store.dispatch(CounterActions.getCounter()));

  if (__SERVER__) {
    return Promise.all(promises);
  }

  return [];
};

export default CounterWrapped;
