import PropTypes from 'prop-types';

const top = PropTypes.string;
const right = PropTypes.string;
const bottom = PropTypes.string;
const left = PropTypes.string;

const Position = PropTypes.shape({
  top,
  right,
  bottom,
  left,
});

export default {
  top,
  right,
  bottom,
  left,
  _type: Position,
};
