import { HOC } from './HOC.js';
import { before } from 'unsolicited-advice';

export const listen = (event, callback) => (component) => {
  // const name = 'listen '+ component.displayName;
  return class extends component {
    // static displayName = name;
    componentDidMount() {
      super.componentDidMount();
      this.node.addEventListener(event, this[callback]);
    }
  };
};
