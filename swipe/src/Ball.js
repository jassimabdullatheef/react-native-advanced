import React, { Component } from 'react'
import { View, StyleSheet, Animated } from 'react-native'

const style = StyleSheet.create({
  ball: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 30,
    borderColor: 'black'
  }
})

class Ball extends Component {
  componentWillMount() {
    this.position = new Animated.ValueXY(0, 0)
    Animated.spring(this.position, {
      toValue: { x: 400, y: 900 }
    }).start()
  }
  render() {
    return (
      <Animated.View style={this.position.getLayout()}>
        <View style={style.ball} />
      </Animated.View>
    )
  }
}

export default Ball
