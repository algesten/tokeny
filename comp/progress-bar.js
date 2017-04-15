import React, {Component} from 'react';
import {
  ProgressViewIOS,
} from 'react-native';
import style from './style'

export default class ProgressBar extends Component {
  constructor() {
    super()
    this.state = {progress:1.0}
  }
  componentDidMount() {
    this.updateProgress()
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.timer)
  }
  updateProgress() {
    const cur = (Math.ceil(Date.now() / (30 * 1000)) * 30 * 1000 - Date.now()) / 30000
    var progress = 1.0 - cur
    this.setState({ progress });
    this.timer = requestAnimationFrame(() => this.updateProgress());
  }
  render() {
    return (
      <ProgressViewIOS
        style={{
          position:'absolute',
          top:64, left:0, right: 0, height:4,
          backgroundColor:style.theme.gray,
        }}
        progress={1 - this.state.progress}
        progressViewStyle='bar'
        progressTintColor={style.theme.yellow}
        />
    )
  }
}
