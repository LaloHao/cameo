import React from 'react';

export class Grid extends React.Component {
  V(x) {
    return <line key={'v'+x} x1={x} y1={0} x2={x} y2="100%" style={styles.line} />;
  }

  H(y) {
    return <line key={'h'+y} x1={0} y1={y} x2="100%" y2={y} style={styles.line} />;
  }

  render() {
    const grid = Array.from({ length: 200 }, (e, i) => i * 10);

    return (
      <svg style={styles.container} xmlns="http://www.w3.org/2000/svg">
        {grid.map(this.V)}
        {grid.map(this.H)}
      </svg>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
  line: {
    stroke: 'rgba(0, 0, 0, 0.5)',
    strokeWidth: 0.3,
  },
};
