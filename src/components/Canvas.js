import React from 'react';
import {
  compose,
  setDisplayName,
  onlyUpdateForPropTypes,
  withProps,
} from 'recompact';

import {
  Platform,
  Animated,
  PanResponder,
  Text,
} from 'react-native';

import {
  Container
} from 'core';

import {
  Renderer,
} from 'components';

import * as t from 'types';

// this.pan = PanResponder.create({
//   onStartShouldSetPanResponder: () => true,
//   onPanResponderMove: (event, gesture) => {
//     event.persist();
//     const { locationX, locationY, pageX, pageY } = event.nativeEvent;
//     // console.log(locationX, locationY, pageX, pageY);
//     const { dx, dy, moveX, moveY } = gesture;
//     this.position.setValue({
//       x: dx,
//       y: dy,
//     });
//   },
// });

// export default class Canvas extends React.Component {
//   constructor(props){
//     super(props);

//     // this.state = props.component;

//     // this.position = new Animated.ValueXY();
//     // this.onResize = this.onResize.bind(this);
//   }

//   componentDidMount() {
//     this.node = ReactDOM.findDOMNode(this);
//     // const printRects = (ms) => ms.forEach(console.log);
//     // new WebKitMutationObserver(printRects).observe(this.node, {
//     //   // attributeFilter: ['style'],
//     //   // attributeOldValue: true,
//     //   attributes: true,
//     //   characterData: true,
//     //   childList: true,
//     //   subtree: true,
//     //   attributeOldValue: true,
//     //   characterDataOldValue: true
//     // });

//     // console.log(this);
//     // this.onResize();
//   };

//   // onResize() {
//   //   const rect = this.node.getBoundingClientRect();
//   //   for(let r in rect) {
//   //     this[r] = rect[r];
//   //   }
//   //   console.log(this.x, this.y, this.width, this.height);
//   // }

//   // componentDidUpdate() {
//   //   this.onResize();
//   // }

//   render() {
//     const {
//       width,
//       height,
//       // flex,
//       scale,
//     } = this.props;
//     // const display = flex ? 'flex' : 'block';
//     const canvas = {
//       // ...this.props.style,
//       width,
//       height,
//       backgroundColor: 'white',
//     };

//     return (
//       <View style={canvas}>
//         {Render(this.props.component)}
//       </View>
//     );
//   }
// }
// Canvas.displayName = 'Canvas';

// {React.createElement(Animated.Text, {
//   style: {
//     position: 'absolute',
//     borderWidth: 1,
//     borderStyle: 'dotted',
//     ...this.position.getLayout()
//   },
//   ...this.pan.panHandlers,
// }, Platform.OS)}

const canvas = { boxShadow: '0px 5px 7px #d3dbec' };
const Canvas = ({ component, top, left, width, height }) => (
  <Container position="absolute" width={width} height={height} top={top} left={left} style={canvas}>
    <Renderer component={component} />
  </Container>
);
Canvas.propTypes = {
  component: t.Component._type.isRequired,
  top: t.Position.top.isRequired,
  left: t.Position.left.isRequired,
  width: t.Size.width.isRequired,
  height: t.Size.height.isRequired,
};

const debug = withProps(console.log);
const enhance = compose(
  setDisplayName('Canvas'),
  onlyUpdateForPropTypes,
  // debug,
);

export default enhance(Canvas);

Canvas.defaultProps = {
  top: '100px',
  left: '100px',
  width: '100px',
  height: '100px',
  scale: 1,
};
