import React from 'react'
import {connect} from 'refnux'
import {
  View,
  Text,
  StatusBar,
  NavigatorIOS,
} from 'react-native';
import List from './list'

export default connect((state, dispatch) => {

  StatusBar.setBarStyle('light-content', true);

  return (
    <NavigatorIOS
      initialRoute={{
        component: List,
        title: 'Tokeny',
        barTintColor: '#000',
        titleTextColor: '#2a7af6',
        translucent: true,
        leftButtonSystemIcon:  'compose',
        rightButtonSystemIcon: 'add',
      }}
      style={{flex:1}}>
    </NavigatorIOS>
  )

})
