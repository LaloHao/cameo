import PropTypes from 'prop-types';

const x = PropTypes.number;
const y = PropTypes.number;

const Coordinate = PropTypes.shape({
  x,
  y,
});

export default {
  x,
  y,
  _type: Coordinate,
};
