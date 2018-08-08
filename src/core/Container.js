import React from 'react';
import styled from 'styled-components';
import { View } from 'react-native';

import {
  flex,
  margin,
  padding,
  width,
  height,
  bgcolor,
  color,
  fontWeight,
  alignSelf,
  alignItems,
  alignContent,
  justifySelf,
  justifyItems,
  justifyContent,
  borderRadius,
  opacity,
  visibility,
  position,
  top,
  right,
  bottom,
  left,
  border,
} from './util';

const Container = styled(View)`
  ${flex};
  ${margin};
  ${padding};
  ${width};
  ${height};
  ${bgcolor}
  ${color};
  ${fontWeight};
  ${alignSelf};
  ${alignItems};
  ${alignContent};
  ${justifySelf};
  ${justifyItems};
  ${justifyContent};
  ${borderRadius};
  ${opacity};
  ${visibility};
  ${position};
  ${top};
  ${right};
  ${bottom};
  ${left};
  ${border};
`;

export default Container;
