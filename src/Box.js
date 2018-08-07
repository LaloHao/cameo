import React from 'react';
import {
  View,
  Animated,
  PanResponder,
} from 'react-native';

import {
  pure,
  onlyUpdateForKeys,
  compose,
} from 'recompose';

import {
  withPanResponder,
} from './enhance';

const box = {
  width: 400,
  height: 400,
  backgroundColor: 'red',
};

const Box = (({ onResponderMove, x, y }) => (
  <View
    style={box}
    onStartShouldSetResponder={() => true}
    onResponderMove={onResponderMove}
    onResponderRelease={() => true}
  >
    <span>{x}, {y}</span>
    {console.log(x,y)}
  </View>
));

export default compose(onlyUpdateForKeys('onResponderMove', 'x', 'y'),withPanResponder)(Box);
// export default Box;
