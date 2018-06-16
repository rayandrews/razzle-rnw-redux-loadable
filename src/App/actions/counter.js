import {
  SET_COUNTER,
  INCREMENT_COUNTER,
  DECREMENT_COUNTER,
} from 'constants/counter';

import { apiUrl } from 'helpers/url';

export const getCounter = () => async (dispatch) => {
  try {
    const response = await fetch(apiUrl(`/api/counter`), {
      accept: 'application/json',
    });
    const { counter } = await response.json();
    dispatch(set(counter));
  } catch (err) {
    dispatch(set(NaN));
  }
};

export const set = (value) => ({
  type: SET_COUNTER,
  payload: value,
});

export const increment = () => ({
  type: INCREMENT_COUNTER,
});

export const decrement = () => ({
  type: DECREMENT_COUNTER,
});

export const incrementIfOdd = () => (dispatch, getState) => {
  const { counter } = getState();

  if (counter % 2 === 0) {
    return;
  }

  dispatch(increment());
};

export const incrementAsync = (delay = 1000) => (dispatch) => {
  setTimeout(() => {
    dispatch(increment());
  }, delay);
};
