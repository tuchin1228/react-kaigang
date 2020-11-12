import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import App from './App';
// import * as serviceWorker from './serviceWorker';
import config from './config';

import apidatas from './reducer/todoreducer';

firebase.initializeApp(config);
// let database = app.database();

// var ref = firebase.database().ref('/news')

// ref.child('article').set('content');
// ref.once('value').then(snapshot => {
//   var val = snapshot.val();
//  console.log(val);
// });
const store = createStore(apidatas, applyMiddleware(thunk));

ReactDOM.render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
  </>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
