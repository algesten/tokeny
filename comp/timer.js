import React, { Component } from 'react';

export default class Timer extends Component {
  constructor(props) {
    super(props)
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
    // XXX, every 30 seconds, for now
    const next = Math.ceil(Date.now() / (30 * 1000)) * 30 * 1000 - Date.now()
    setTimeout(this.fire, next)
  }
  fire() {
    this.props.dispatch(() => {
      return {increaser:Date.now()}
    })
    this.schedule()
  }
  render() {
    return null
  }
}
