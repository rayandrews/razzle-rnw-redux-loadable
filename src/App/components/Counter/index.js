import React from 'react';
import PropTypes from 'prop-types';

import { View, Text } from 'react-native';

const Counter = ({
  increment,
  incrementIfOdd,
  incrementAsync,
  decrement,
  counter,
}) => (
  <View>
    <View>
      <Text>Clicked: {counter} times</Text>
    </View>
    <View>
      <Text onPress={increment}>+</Text>
      <Text onPress={decrement}>-</Text>
      <Text onPress={incrementIfOdd}>Increment if odd</Text>
      <Text onPress={() => incrementAsync()}>Increment async</Text>
    </View>
  </View>
);

Counter.propTypes = {
  increment: PropTypes.func.isRequired,
  incrementIfOdd: PropTypes.func.isRequired,
  incrementAsync: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  counter: PropTypes.number.isRequired,
};

export default Counter;
