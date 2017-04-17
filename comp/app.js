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

// ref to the NavigatorIOS component
var navRef = {}

const later = (fn) => setTimeout(fn, 0)

export default connect((state, dispatch) => {
  const {navigator} = state

  StatusBar.setBarStyle('light-content', true);

  if (navRef.setState) {
    // this is a hack to force NavigatorIOS to redraw the children.
    // the docs says for "performance optimmization reasons, they
    // try to avoid it. but this messes with refnux top-down redraw
    //
    // here is the optimization we're trying to trick by setting this to
    // and thus redrawing everything
    // https://github.com/facebook/react-native/blob/0.42-stable/Libraries/Components/Navigation/NavigatorIOS.ios.js#L877
    if (navRef.state.updatingAllIndicesAtOrBeyond === null) {
      later(() => navRef.setState({updatingAllIndicesAtOrBeyond:0}))
    }
  }

  return (
    <NavigatorIOS
      ref={(_navRef) => navRef = _navRef}
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
