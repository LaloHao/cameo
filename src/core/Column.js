import React from 'react';
import PropTypes from 'prop-types';
import Container from './Container';
import {
  get,
  without,
  withProps,
  between,
} from './util';

const Raw = Container.extend`
  flex-direction: column;
`;

const Column = (props) => {
  const spacing = get('spacing')(props);
  const children = get('children')(props);

  if (!spacing || !Array.isArray(children)) { return <Raw {...props} />; }

  // const space = <Container margin={`0 ${spacing} 0 0`} />;
  const space = withProps({ margin: `0 0 ${spacing} 0` })(Container);
  const newProps = without('spacing', 'children')(props);

  return (
    <Raw {...newProps}>
      {children.reduce(between(space))}
    </Raw>
  );
};

Column.propTypes = {
  children: PropTypes.any,
  spacing: PropTypes.string,
};

export default Column;
