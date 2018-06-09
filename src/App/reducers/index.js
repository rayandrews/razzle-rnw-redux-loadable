import { combineReducers } from 'redux';
import counter from './counter';

/* eslint-disable */

export const K_SYSTEM_RESET_STORE = 'K_SYSTEM_RESET_STORE';

// // Initial routing state
// const routeInitialState = {
//   location: null,
// };

// /**
//  * Merge route into the global application state
//  */
// function routeReducer(state = routeInitialState, action) {
//   switch (action.type) {
//     /* istanbul ignore next */
//     case LOCATION_CHANGE:
//       return Object.assign({}, state, {
//         location: action.payload,
//       });
//     default:
//       return state;
//   }
// }

const rootReducer = combineReducers({
  counter,
  // route: routeReducer
});

export default function appReducer(state, action) {
  return function(state, action) {
    if (action.type === K_SYSTEM_RESET_STORE) state = undefined;

    return rootReducer(state, action);
  };
}
