import React, { Component } from 'react';
import {createStore, Provider} from 'refnux';
import model from './lib/model.js'
import {
  AppRegistry,
  NativeModules,
} from 'react-native';
import App from './comp/app'
import receiveAllTokens from './action/receive-all-tokens'

var store = createStore(model)

class Root extends Component {
  render() {
    return (
        <Provider store={store} app={App} />
    )
  }
}

const {KeychainStore} = NativeModules

KeychainStore.readAll().then((dict) => {
  store.dispatch(receiveAllTokens(dict))
})

AppRegistry.registerComponent('tokeny', () => Root);
