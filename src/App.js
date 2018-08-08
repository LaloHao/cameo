import React from 'react';
import {
  Text,
} from 'react-native';

import {
  setDisplayName,
  withStateHandlers,
  withProps,
  compose,
} from 'recompact';

import {
  withResponder,
  withStoreComponents,
} from './enhance';

import {
  Column,
  Container,
} from 'core';

import {
  Canvas,
} from 'components';

const input = { display: 'flex', flex: 1 };
const string = component => JSON.stringify(component, null, 2);
const App = ({ handlers, position, click, onChange, store: { components }, component }) => (
  <Container {...handlers} flex="1" bgcolor="gray">
    <Canvas component={component.data()} width="500px" height="300px" top="100px" left="100px" />
    <Container position="absolute" top="30px" right="30px">
    </Container>
    <Container position="absolute" bottom="30px" left="30px" width="300px" height="300px">
      <textarea style={input} value={string(component.data())} readOnly />
    </Container>
    <Column position="absolute" bottom="30px" right="30px">
      <Text>mouse: {position.x}, {position.y}</Text>
      <Text>click: {click.x}, {click.y}</Text>
    </Column>
  </Container>
);

// <Components components={components} onChange={onChange} value={component} />

const Component = (component, i) => (
  <option value={i} key={i}>
    {component.data().displayName}
  </option>
);

const Components = ({ components, onChange, value }) => (
  <select onChange={onChange} value={value}>
    {components.map(Component)}
  </select>
);

const debug = withProps(console.log);
const enhance = compose(
  setDisplayName('App'),
  withStoreComponents,
  withStateHandlers(
    () => ({ component: 1 }),
    {
      onChange: (_, { store }) => ({
        nativeEvent: {
          target: {
            value: component,
          },
        },
      }) => ({ component }),
    },
  ),
  withProps(({ store, component }) => ({
    component: store.components.find(({ id }) => component),
  })),
  // debug,
  withResponder,
);

export default enhance(App);
