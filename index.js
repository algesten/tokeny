import React, { Component } from 'react';
import {createStore, Provider} from 'refnux';
import model from './lib/model.js'
import {
  AppRegistry,
} from 'react-native';
import App from './comp/app'
import loadAll from './lib/load-all'

var store = createStore(model)

class Root extends Component {
  render() {
    return (
        <Provider store={store} app={App} />
    )
  }
}

// kick it off by loading all entries
// from the keychain
loadAll(store.dispatch)

AppRegistry.registerComponent('tokeny', () => Root);
