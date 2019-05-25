import React, { Component } from 'react'
import { Text, View, Animated, StyleSheet } from 'react-native'

export default class Deck extends Component {
  renderCards() {
    const { data, renderCard } = this.props
    return data.map(item => renderCard(item))
  }

  render() {
    const { data, renderCard } = this.props
    return <View>{this.renderCards()}</View>
  }
}
