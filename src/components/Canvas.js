import React from 'react';
import { compose } from 'recompose';

import {
  View,
  Platform,
  Animated,
  PanResponder,
  Text,
} from 'react-native';

const Element = (type, props, children) => {
  return React.creatElement(type, props, children);
};

const Render = (component) => {
  if (typeof component === 'string') { return component; }

  let children = component.children;
  if (component.children) {
    if (Array.isArray(component.children)) {
      children = component.children.map(Render);
    }
  }

  return Element(component.type, component.props, children);
};

const Renderer = ({ component }) => Render(component);

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

export class Canvas extends React.Component {
  constructor(props){
    super(props);

    this.state {
      component = {
        type: 'div',
        props: {
          style: {
            flex: 1,
            backgroundColor: 'blue',
          },
        },
        children: [
          { type: Text, props: { key: 1, flex: 1 }, children: 'a' },
          { type: Text, props: { key: 2, flex: 1 }, children: 'b' },
          // <Text key={1}>test</Text>,
        ],
      }
    };


    // this.position = new Animated.ValueXY();
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);
    const printRects = (ms) => ms.forEach(console.log);
    new WebKitMutationObserver(printRects).observe(this.node, {
      // attributeFilter: ['style'],
      // attributeOldValue: true,
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true
    });

    // console.log(this);
    this.onResize();
  };

  onResize() {
    const rect = this.node.getBoundingClientRect();
    for(let r in rect) {
      this[r] = rect[r];
    }
    console.log(this.x, this.y, this.width, this.height);
  }

  renderComponent() {
    const { component } = this.props;
    return React.createElement(component.type, component,props, component.children);
  }

  componentDidUpdate() {
    this.onResize();
  }

  render() {
    const {
      width,
      height,
      // flex,
      scale,
    } = this.props;
    // const display = flex ? 'flex' : 'block';
    const canvas = {
      // ...this.props.style,
      width,
      height,
      backgroundColor: 'white',
    };

    return (
      <View style={canvas}>
        {this.renderComponent()}
      </View>
    );
  }
}
Canvas.displayName = 'Canvas';

// {React.createElement(Animated.Text, {
//   style: {
//     position: 'absolute',
//     borderWidth: 1,
//     borderStyle: 'dotted',
//     ...this.position.getLayout()
//   },
//   ...this.pan.panHandlers,
// }, Platform.OS)}

Canvas.defaultProps = {
  width: 100,
  height: 100,
  scale: 1,
  flex: false,
};
