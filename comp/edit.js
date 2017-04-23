import React, {Component} from 'react';
import {
  SwipeableListView,
  ActionSheetIOS,
  ListView,
  Button,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {connect} from 'refnux'
import style from './style'
import deleteToken from '../action/delete-token'
import saveToken from '../action/save-token'

export default connect((state, dispatch, props) => {
  const {navigator} = state

  // the token to edit
  const {token} = props

  // {
  //   type: 'totp',
  //   account: 'alice@google.com',
  //   key: 'JBSWY3DPEHPK3PXP',
  //   issuer: 'Example',
  //   digits: 6,
  //   url: 'otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example',
  //   ordinal: 999
  // }

  return (
    <View style={{flex:1, backgroundColor:'#000', padding:15, paddingTop:100}}>
      <View style={{flexDirection:'row'}}>
        <View style={{flex:1}}>
          {labelled('Type:', token.type)}
          {labelled('Algorithm:', token.algorithm || 'SHA1')}
        </View>
        <View style={{flex:1}}>
          {labelled('Digits:', token.digits || 6)}
          {(() => {
            if (token.type == 'hotp') {
              return labelled('Counter:', token.counter)
            } else {
              return labelled('Period:', token.period || 30)
            }
          })()}
        </View>
      </View>
      <Editable
        label="Issuer:"
        value={token.issuer}
        color={style.theme.orange}
        onUpdate={(issuer) => {
          const updated = Object.assign({}, token, {issuer})
          dispatch(saveToken(updated))
        }}
        />
      <Editable
        label="Account:"
        value={token.account}
        color={style.theme.yellow}
        onUpdate={(account) => {
          const updated = Object.assign({}, token, {account})
          dispatch(saveToken(updated))
        }}
        />
      <View style={{position:'absolute', bottom:30, left:0, right:0, backgroundColor:'#111'}}>
        <Button
          onPress={() => {
            ActionSheetIOS.showActionSheetWithOptions({
              message:'This will NOT turn off two-factor '+
                'authentication for the service. '+
                'You may lose access.',
              options:[
                'Delete Token', 'Cancel'
              ],
              destructiveButtonIndex: 0,
              cancelButtonIndex: 1,
            }, (buttonIndex) => {
              if (buttonIndex == 0) {
                dispatch(deleteToken(token))
                navigator.pop()
              }
            })
          }}
          title="Delete Token"
          color="#d92a00"
          />
      </View>
    </View>
  )

})


const labelled = (label, value) => {
  return (
    <View style={{flexDirection:'row', marginBottom:10}}>
      <Text style={[style.label, {width:85, textAlign:'left', marginRight:10}]}>{label}</Text>
      <Text style={[style.value]}>{value}</Text>
    </View>
  )
}



class Editable extends Component {

  constructor(props) {
    super(props)
    this.state = {value:props.value}
    this.onChangeText = this.onChangeText.bind(this)
    this.fire = this.fire.bind(this)
  }

  onChangeText(text) {
    this.setState({value:text})
    this.scheduleUpdate()
  }

  scheduleUpdate() {
    clearTimeout(this.timer)
    this.timer = setTimeout(this.fire, 1000)
  }

  fire() {
    this.props.onUpdate(this.state.value)
  }

  render() {
    return (
      <View style={{paddingTop:35}}>
        <Text style={[style.label, {marginBottom:5}]}>{this.props.label}</Text>
        <TextInput
          style={[style.textInput, {color:this.props.color}]}
          onChangeText={this.onChangeText}
          value={this.state.value}
          />
      </View>
    )
  }

}
