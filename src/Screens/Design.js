import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import {
  Component,
  Canvas,
  MouseCoordinates,
  Grid,
} from '../components';

@listen('mousemove', 'onMouseMove')
export default class Design extends Component {
  static displayName = 'Design';
  constructor(props){
    super(props);

    this.state = {
      scale: 1,
      mouse: {
        x: 0,
        y: 0,
      },
    };

    this.onWheel = this.onWheel.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  // @after
  // componentDidMount() {
  //   // const advices = Advisor(this);
  //   // console.log(advices.map);
  //   // console.log(advices.get('componentDidMount'));
  //   // advices.trigger(0);
  //   // this.node.addEventListener(event, this[callback]);
  // }

  // componentDidMount() {
  //   // const ro = new ResizeObserver( entries => {
  //   //   // for (let entry of entries) {
  //   //   //   const cr = entry.contentRect;
  //   //   //   console.log('Element:', entry.target);
  //   //   //   console.log(`Element size: ${cr.width}px x ${cr.height}px`);
  //   //   //   console.log(`Element padding: ${cr.top}px ; ${cr.left}px`);
  //   //   // }
  //   // });

  //   // ro.observe(this.node);
  // }

  // @after
  // componentDidMount = () => {
  //   console.log(this.node);
  // }

  onWheel(event) {
    event.persist();

    let { scale } = this.state;

    if (event.deltaY.positivep()) {
      scale -= .1;
    }
    if (event.deltaY.negativep()) {
      scale += .1;
    }
    this.setState({ scale });
    // console.log(this.canvas.subscribed)
    // const r = ReactDOM.findDOMNode(this.canvas).getBoundingClientRect();
    // console.log(r);

    // console.log(event);
  }

  onMouseMove(event) {
    console.log(event);
    const x = (event.pageX - this.canvas.x);
    const y = (event.pageY - this.canvas.y);

    const mouse = { x, y };

    this.setState({ mouse });
    // console.log(event.target === this.node);
    // const { screenX, screenY, clientX, clientY, offsetX, offsetY } = event;
    // const mouse = { screenX, screenY, clientX, clientY };
    // this.setState({ mouse });
    // console.log(screenX, screenY, clientX, clientY, target);
    // console.log(event);
  }

  render() {
    const { scale } = this.state;

    return (
      <View
        style={styles.container}
        onWheel={this.onWheel}
        id="design"
        >
        <Grid />
        <Canvas
          ref={canvas => this.canvas = canvas}
          scale={this.state.scale}
          style={styles.canvas}
          />
          <View style={styles.coordinates}>
            <MouseCoordinates mouse={this.state.mouse} />
          </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  canvas: {
    position: 'absolute',
    right: 150,
    bottom: 150,
  },
  coordinates: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 10,
  },
};
