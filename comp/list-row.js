import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import style from './style'

import {authenticator} from '../lib/otplib'

export default class ListRow extends Component {

  constructor(props) {
    super(props)
    this.state = {now:Date.now()}
    this.fire = this.fire.bind(this)
  }

  componentDidMount() {
    this.schedule()
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  schedule() {
    clearTimeout(this.timer)
    const secs = this.props.token.period || 30
    const next = Math.ceil(Date.now() / (secs * 1000)) * secs * 1000 - Date.now()
    this.timer = setTimeout(this.fire, next)
  }

  fire() {
    // trigger redraw
    this.setState({now:Date.now()})

    // and wait for next
    this.schedule()
  }

  render() {
    const token = this.props.token
    return (
      <View style={{}}>
        <View style={{padding:15}}>
          <Text style={[style.listText, {fontSize:60, fontWeight:'200'}]}>
            {authenticator.generate(token.key)}
          </Text>
          <View style={{flexDirection:'row'}}>
            <Text style={[style.listText, {color:style.theme.orange}]}>{token.issuer || ''}</Text>
            <Text> </Text>
            <Text style={[style.listText, {color:style.theme.yellow}]}>{token.account || ''}</Text>
          </View>
        </View>
      </View>
    )
  }

}
