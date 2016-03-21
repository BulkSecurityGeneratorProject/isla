import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route} from 'react-router';

import App from './App';
import Default from './view/Default';
import store from './store';
import Login from './auth/Login.component';
import CourseList from './course/CourseList.component';
import Register from './auth/Register.component';
import history from './history';

import {fetchCourses} from './course/course';
import {fetchLectures} from './lecture/lecture';
store.dispatch(fetchCourses());
store.dispatch(fetchLectures());

ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route component={App}>
        <Route component={Default} path="/">
          <Route component={Login} path="authenticate" />
          <Route component={CourseList} path="courses" />
          <Route component={Register} path="register" />
        </Route>
      </Route>
    </Router>
  </Provider>
  ), document.getElementById('app')
);
