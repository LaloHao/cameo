import React from 'react';
import { View } from 'react-native';

export class Element extends React.Component {
  render() {
    const { type, props, children, selected } = this.props;
    const element = React.createElement(type, props, children);
    const style = selected? styles.selected : null;
    return <View style={style}>{element}</View>;
  }
}

const styles = {
  selected: {
    borderWidth: 1,
    borderStyle: 'dotted',
  },
};
