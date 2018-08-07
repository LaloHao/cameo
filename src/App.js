import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import ReactTestUtils from 'react-dom/test-utils';
// import ReactNativeComponentTree from 'ReactNativeComponentTree';

import recompact, {
  setDisplayName,
  withStateHandlers,
  withProps,
} from 'recompact';

import {
  // withMouseMove,
  withResponder,
} from './enhance';

import { Canvas } from 'components';

const debug = withProps(console.log);

const enhance = recompact.compose(
  setDisplayName('App'),
  withStateHandlers(
    () => ({ component: {} }),
    {
      onChange: () => component => ({ component }),
    },
  ),
  withResponder,
);

const App = ({ handlers, position, click, component, onChange }) => (
  <View {...handlers} style={{ flex: 1 }}>
    <Canvas component={component} onChange={onChange} />
    <View style={{ position: 'absolute', right: 30, bottom: 30, flex: 0 }}>
      <Text>mouse: {position.x}, {position.y}</Text>
      <Text>click: {click.x}, {click.y}</Text>
    </View>
  </View>
);

// {console.log(click)}
export default enhance(App);
