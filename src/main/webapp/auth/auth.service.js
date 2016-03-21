import fetch from 'isomorphic-fetch';
import config from '../config';

import {
  requestLogin,
  receiveLogin,
  loginError,
  receiveLogout
} from './auth';

export const authenticate = () => {
  return dispatch => {
    if (!localStorage.token) {
      return Promise.reject('authentication error');
    }
    return fetch(`http://${config.api.host}:${config.api.port}/api/account`, {
      headers: {
        Accept: 'application/json',
        Authorization: localStorage.token
      }
    })
      .then(response => response.json())
      .then(json => dispatch(receiveLogin(json)))
      .catch(err => dispatch(loginError(err)));
  };
};

export const login = credentials => {
  return dispatch => {
    dispatch(requestLogin());
    let body = 'j_username=' + encodeURIComponent(credentials.login) +
      '&j_password=' + encodeURIComponent(credentials.password) +
      '&remember-me=false&submit=Login';
    return fetch(`http://${config.api.host}:${config.api.port}/api/authentication`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    })
      .then(response => {
        if (!response.ok) {
          return Promise.reject('authentication error');
        }
        return response.json();
      })
      .then(json => {
        localStorage.setItem('token', `Bearer ${json.token}`);
        dispatch(authenticate());
      })
      .catch(err => dispatch(loginError(err)));
  };
};

export const logout = () => {
  return dispatch => {
    fetch(`http://${config.api.host}:${config.api.port}/api/logout`)
      .then(() => {
        localStorage.removeItem('token');
        dispatch(receiveLogout());
      });
  };
};

