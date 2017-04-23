import React from 'react'
import {connect} from 'refnux'
import {
  View,
  Text,
  StatusBar,
} from 'react-native'
import List from './list'
import Camera from './camera'
import style from './style'

// using a hacked version of NavigatorIOS that always
// propagates redraws to its children.
import NavigatorIOSXXX from '../NavigatorIOS'

const nativeImageSource = require('nativeImageSource')

const later = (fn) => setTimeout(fn, 0)

export default connect((state, dispatch) => {
  const {navigator} = state

  StatusBar.setBarStyle('light-content', true);

  return (
    <NavigatorIOSXXX
      initialRoute={{
        component: List,
        title: 'Tocan',
        barTintColor: '#000',
        tintColor: style.theme.orange,
        titleTextColor: style.theme.orange,
        translucent: true,
        rightButtonSystemIcon: 'add',
        onRightButtonPress: () => {
          dispatch((state) => {
            state.navigator.push({
              component: Camera,
              title: 'Add',
              barTintColor: '#000',
              tintColor: style.theme.orange,
              titleTextColor: style.theme.orange,
              translucent: true,
            })
            return {}
          })
        },
      }}
      style={{flex:1}}>
    </NavigatorIOSXXX>
  )

})
