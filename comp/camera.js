import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  VibrationIOS,
} from 'react-native';

import Camera from 'react-native-camera';

export default () => {

  return (
    <Camera
      style={{flex:1, alignItems: 'center'}}
      onBarCodeRead={(ev) => {console.log(ev.data)}} >
      <View style={{}}>
        <View style={{}}/>
      </View>
    </Camera>
  )

}
