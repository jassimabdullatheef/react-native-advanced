import React, { Component } from 'react'
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager
} from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25
const SWIPE_OUT_DURATION = 250

export default class Deck extends Component {
  static defaultProps = {
    onSwipeLeft: () => {},
    onSwipeRight: () => {},
    renderNoMoreCards: () => {}
  }

  constructor(props) {
    super(props)

    const position = new Animated.ValueXY()
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: 0 })
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe('right')
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('left')
        } else {
          this.resetPosition()
        }
      }
    })
    const index = 0

    this.state = { panResponder, position, index }
  }

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true)

    LayoutAnimation.spring()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props.data) {
      this.setState({ index: 0 })
    }
  }

  forceSwipe(direction) {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH
    Animated.timing(this.state.position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start(() => {
      this.onSwipeComplete(direction)
    })
  }

  onSwipeComplete(direction) {
    const { onSwipeLeft, onSwipeRight, data } = this.props
    const item = data[this.state.index]
    this.setState({ index: this.state.index + 1 })
    this.state.position.setValue({ x: 0, y: 0 })

    direction === 'left' ? onSwipeLeft(item) : onSwipeRight(item)
  }

  resetPosition() {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start()
  }

  getCardStyle() {
    const { position } = this.state

    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg']
    })

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    }
  }

  renderCards() {
    const { data, renderCard } = this.props
    const { panResponder } = this.state

    if (data.length <= this.state.index) {
      return this.props.renderNoMoreCards()
    }

    return data
      .map((item, i) => {
        if (i === this.state.index) {
          return (
            <Animated.View
              key={item.id}
              style={[this.getCardStyle(), styles.cardStyle]}
              {...panResponder.panHandlers}>
              {renderCard(item)}
            </Animated.View>
          )
        } else if (i > this.state.index) {
          return (
            <Animated.View
              key={item.id}
              style={[
                styles.cardStyle,
                {
                  top: 10 * (i - this.state.index),
                  width: SCREEN_WIDTH - 20 * (i - this.state.index),
                  left: 10 * (i - this.state.index)
                }
              ]}>
              {renderCard(item)}
            </Animated.View>
          )
        }

        return null
      })
      .reverse()
  }

  render() {
    return <View>{this.renderCards()}</View>
  }
}

const styles = {
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH
  }
}
