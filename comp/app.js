import React from 'react'
import {connect} from 'refnux'
import {
  View,
  Text,
  StatusBar,
  NavigatorIOS,
} from 'react-native'
import List from './list'
import Camera from './camera'
import style from './style'

const nativeImageSource = require('nativeImageSource')

export default connect((state, dispatch) => {

  StatusBar.setBarStyle('light-content', true);

  return (
    <NavigatorIOS
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
    </NavigatorIOS>
  )

})
