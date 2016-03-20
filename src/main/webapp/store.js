import {createStore, applyMiddleware, compose} from 'redux';
import {routerMiddleware} from 'react-router-redux';

import reducers from './reducers';
import DevTools from './Devtools';
import {authenticate} from './auth/auth.service';

import thunk from 'redux-thunk';

const production = () => {
  const finalCreateStore = compose(
    applyMiddleware(thunk, routerMiddleware)
  )(createStore);
  return finalCreateStore(reducers);
};

const development = () => {
  const finalCreateStore = compose(
    applyMiddleware(thunk, routerMiddleware),
    DevTools.instrument()
  )(createStore);
  const store = finalCreateStore(reducers);
  if (module.hot) {
    module.hot.accept('./reducers', () =>
      store.replaceReducer(reducers)
    );
  }
  return store;
};

const store = process.env.NODE_ENV === 'production' ?
  production() : development();

// if jwt found..
if (localStorage.token) {
  store.dispatch(authenticate());
}

export default store;
