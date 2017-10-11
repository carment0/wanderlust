import React, { Component } from 'react';
import Routers from './src/router';
import { Provider } from 'react-redux';
import configStore from './src/store/config_store';
import { View } from 'react-native';
import firebaseRef from './src/firebase';

firebaseRef();

export default class App extends Component {
  render() {
    const store = configStore();
    return (
      <Provider store={ store }>
          <Routers />
      </Provider>
    );
  }
}
