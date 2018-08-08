import PropTypes from 'prop-types';

const width = PropTypes.string;
const height = PropTypes.string;

const Size = PropTypes.shape({
  width,
  height,
});

export default {
  width,
  height,
  _type: Size,
};
