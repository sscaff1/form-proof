import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import shippingApp from './reducers';

export default function configureStore(initialState) {
  const composeEnhancers = module.hot
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;
  const composeWithMiddleware = composeEnhancers(applyMiddleware(thunk))(
    createStore
  );
  const store = composeWithMiddleware(shippingApp, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
