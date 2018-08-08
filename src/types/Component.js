import PropTypes from 'prop-types';

const type = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.func,
]);
const props = PropTypes.object;
const children = PropTypes.oneOfType([
  PropTypes.array,
  PropTypes.string,
]);

const Component = PropTypes.shape({
  type,
  props,
  children,
});

export default {
  type,
  props,
  children,
  _type: Component,
};
