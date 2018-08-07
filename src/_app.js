import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Animated,
  PanResponder,
} from 'react-native';

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

export default class App extends React.Component {
  constructor(props){
    super(props);

    this.position = new Animated.ValueXY();
    this.pan = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        event.persist();
        const { locationX, locationY, pageX, pageY } = event.nativeEvent;
        console.log(locationX, locationY, pageX, pageY);
        const { dx, dy, moveX, moveY } = gesture;
        // console.log(dx, dy);
        this.parent.measure((fx, fy, width, height) => {
          // console.log(fx, fy, width, height, dx, dy);

          const x = (pageX - fx).clamp(0, width);
          const y = (pageY - fy).clamp(0, height);
          // console.log(x, y);

          this.position.setValue({
            // x: this.position.x.interpolate({
            //     inputRange: [0, width],
            //     outputRange: [fx, fx + width],
            //     extrapolate: 'clamp',
            // }),
            // y: this.position.y.interpolate({
            //     inputRange: [0, height],
            //     outputRange: [fy, fy + height],
            // }),
            x,
            y,
          });

        });
      },
    });
  }

  onLayout(x, y) {
    this.position = new Animated.ValueXY({ x, y });
  }

  render() {
    // console.log(React.createElement(Text, null, 'test'));
    return (
      <View style={styles.container}>
        <Text>Open up src/App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
        {React.createElement(Text, null, 'test')}
        <View
          ref={parent => this.parent = parent}
          style={{
            position: 'relative',
            width: 250,
            height: 250,
          }}>
          {React.createElement(Animated.Text, {
            style: {
              position: 'absolute',
              borderWidth: 1,
              borderStyle: 'dotted',
              ...this.position.getLayout()
            },
            ...this.pan.panHandlers,
          }, Platform.OS)}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    // height: 1500,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
