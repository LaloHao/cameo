import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import util from 'util';
import t from 'types/Component';
import Container from 'core/Container';
import {
  compose,
  setDisplayName,
  withStateHandlers,
  withProps,
} from 'recompact';

const Element = ({ type, props, children, onClick, border }) => (
  <ErrorBoundary key={props.key}>
    <Container onClick={onClick} border={border} style={{ boxSizing: 'border-box' }}>
      {React.createElement(type, props, children)}
    </Container>
  </ErrorBoundary>
);
Element.propTypes = {
  type: t.type.isRequired,
  props: t.props.isRequired,
  children: t.children.isRequired,
};

const debug = withProps(console.log);
const enhance = compose(
  setDisplayName('Element'),
  withStateHandlers(
    () => ({ selected: false }),
    {
      onClick: ({ selected }) => (event) => {
        event.stopPropagation();
        event.nativeEvent.stopPropagation();
        // console.log('clicked', util.inspect(event.nativeEvent.target));
        return { selected: !selected };
      },
    },
  ),
  withProps(({ selected, onClick }) => ({
    border: selected? '1px dashed black' : null,
    margin: selected? '-1px' : null,
    onClick,
  })),
  // debug,
);

export default enhance(Element);
