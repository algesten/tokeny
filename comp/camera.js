import React, { Component } from 'react'
import {connect} from 'refnux'

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Vibration,
} from 'react-native'

import Camera from 'react-native-camera'

import addToken from '../action/add-token'

export default connect((state, dispatch) => {
  const {navigator} = state

  // setTimeout(()=>{
  //   Vibration.vibrate()
  //   navigator.pop()
  //   dispatch(addToken('otpauth://totp/martin?secret=123&issuer=github'))
  // }, 1000)

  // otpauth://totp/martin?secret=123&issuer=github
  // otpauth://hotp/martin?secret=123&issuer=github&counter=0
  return (
    <Camera
      style={{flex:1, alignItems: 'center'}}
      onBarCodeRead={(ev) => {
        const url = ev.data
        Vibration.vibrate()
        navigator.pop()
        dispatch(addToken(url))
      }} >
      <View style={{
              flex:1,
              alignItems:'center',
              justifyContent:'center',
              backgroundColor:'transparent'
            }}>
        <View style={{
                height: 300,
                width: 300,
                borderWidth: 1,
                borderColor: '#0f0',
                backgroundColor: 'transparent'
              }}/>
      </View>
    </Camera>
  )

})
