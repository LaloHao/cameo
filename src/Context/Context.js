import React from 'react';
import ReactDOM from 'react-dom';

const Context = {};
Context.values = {
  aString: 'test string'
};

Context.types = {
  aString: string,
}

const { types, values } = Context;
// PropTypes.checkPropTypes(types, values, 'context', 'Context');

const { Provider, Consumer } = React.createContext(Context.values);
export { Provider, Consumer };
