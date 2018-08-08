import React from 'react';
import uid from 'uid';
import Element from 'components/Element';
import {
  Text
} from 'react-native';
import {
  Container,
  Row,
  Column,
} from 'core';

const components = {
  Container,
  Row,
  Column,
  Text,
};

const Render = (component, key) => {
  if (typeof component === 'string') { return component; }

  let { type } = component;
  if (Reflect.has(components, type)) {
    type = Reflect.get(components, type);
  }

  let { props } = component;
  props = { ...props, id: uid(), key };

  let { children } = component;
  if (component.children) {
    if (Array.isArray(component.children)) {
      children = component.children.map(Render);
    }
  }

  return (
    <Element
      type={type}
      props={props}
      children={children}
      key={key}
    />
  );
};

const Renderer = ({ component }) => Render(component);

export default Renderer;
