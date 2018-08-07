import React from 'react';
import { View, Text } from 'react-native';

export class MouseCoordinates extends React.Component {
  render() {
    const { screenX, screenY, target } = this.props.mouse;
    const { x, y } = this.props.mouse;
    // const x = screenX;
    // const y = screenY;

    return (
      <View>
        <Text>{target}</Text>
        <Text>x: {x}, y: {y}</Text>
      </View>
    );
  }
};
