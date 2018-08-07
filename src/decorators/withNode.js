import ReactDOM from 'react-dom';
import { HOC } from './HOC.js';

export const withNode = (component) => {
  return class extends component {
    componentDidMount() {
      this.node = ReactDOM.findDOMNode(this);
      super.componentDidMount && super.componentDidMount();
    }
  };
};
