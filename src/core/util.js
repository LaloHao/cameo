import React from 'react';
import {
  setDisplayName,
  wrapDisplayName,
} from 'recompose';

export const style = (prop, css, fallback) => (props) => {
  const value = props[prop];

  if (!value) {
    if (fallback) {
      return `${css}: ${fallback}`;
    }
    return null;
  }

  return `${css}: ${value}`;
};

export const color = style('color', 'color', 'inherit');
export const bgcolor = style('bgcolor', 'background-color');
export const borderRadius = style('borderRadius', 'border-radius');
export const opacity = style('opacity', 'opacity');
export const visibility = style('visibility', 'visibility');

export const fontWeight = style('fontWeight', 'font-weight');
export const fontSize = style('fontSize', 'font-size', '14px');

export const margin = style('margin', 'margin');
export const padding = style('padding', 'padding');
export const width = style('width', 'width');
export const height = style('height', 'height');

export const alignSelf = style('alignSelf', 'align-self');
export const alignItems = style('alignItems', 'align-items');
export const alignContent = style('alignContent', 'align-content');

export const justifySelf = style('justifySelf', 'justify-self');
export const justifyItems = style('justifyItems', 'justify-items');
export const justifyContent = style('justifyContent', 'justify-content');

export const zIndex = style('zIndex', 'z-index');
export const position = style('position', 'position', 'relative');
export const top = style('top', 'top');
export const right = style('right', 'right');
export const bottom = style('bottom', 'bottom');
export const left = style('left', 'left');

export const border = style('border', 'border');

export const identity = x => x;
export const get = (value, otherwise) => props => props[value] || otherwise;

// shorthard property
export const flex = (props) => {
  if (props.flex === false) { return null; }
  return `display: flex; flex: ${props.flex || '0 1 auto'}`;
};

export const between = insert => (comp1, comp2) => (
  <React.Fragment>
    {comp1}
    {insert}
    {comp2}
  </React.Fragment>
);

export const withProps = props => Component => <Component {...props} />;
export const without = keys => (obj) => {
  const Obj = { ...obj };

  for (const key in keys) {
    delete Obj[key];
  }

  return Obj;
};

export const fromRenderProps = (
  RenderPropsComponent,
  propsMapper,
  renderPropName = 'children'
) => (BaseComponent) => {
  const baseFactory = React.createFactory(BaseComponent);
  const renderPropsFactory = React.createFactory(RenderPropsComponent);

  const FromRenderProps = ownerProps =>
        renderPropsFactory({
          [renderPropName]: (...props) =>
            baseFactory({ ...ownerProps, ...propsMapper(...props) }),
        });

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'fromRenderProps'))(
      FromRenderProps
    );
  }

  return FromRenderProps;
};

export const toRenderProps = (hoc) => {
  const RenderPropsComponent = props => props.children(props);
  return hoc(RenderPropsComponent);
};
