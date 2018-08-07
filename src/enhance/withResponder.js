import React from 'react';
import { Observable } from 'rxjs/Rx'

import {
  mapPropsStream,
  createEventHandler,
} from 'recompact';

export const withResponder = mapPropsStream(props$ => {
  const { handler: onStartShouldSetResponder, stream: onStartShouldSetResponder$ } = createEventHandler();
  const { handler: onMoveShouldSetResponder, stream: onMoveShouldSetResponder$ } = createEventHandler();
  const { handler: onResponderGrant, stream: onResponderGrant$ } = createEventHandler();
  const { handler: onResponderReject, stream: onResponderReject$ } = createEventHandler();
  const { handler: onResponderMove, stream: onResponderMove$ } = createEventHandler();
  const { handler: onResponderRelease, stream: onResponderRelease$ } = createEventHandler();
  const { handler: onResponderTerminationRequest, stream: onResponderTerminationRequest$ } = createEventHandler();
  const { handler: onResponderTerminate, stream: onResponderTerminate$ } = createEventHandler();

  const coordinates = event => {
    event.preventDefault();
    event.nativeEvent.preventDefault();
    // event.stopPropagation();
    // event.nativeEvent.stopPropagation();
    return { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY };
  };

  // const onStart$ =

  const initial = { x: 0, y: 0 };

  const click$ = onStartShouldSetResponder$
    // .switchMap(() => onResponderGrant$)
    .map(coordinates)
    .startWith(initial);

  // const click$ = onResponderGrant$
  //   .map(coordinates)
  //   .startWith(initial);

  // onResponderReject$.map(e => console.log(e));
  // const click$ = onStartShouldSetResponder$
  //   // .do(start$ => console.log('started?', start$))
  //   .map(coordinates)
  //   .startWith(initial);

  const position$ = onMoveShouldSetResponder$
    .throttleTime(100)
    .map(coordinates)
    .startWith(initial);

  return props$.map(props => ({
    ...props,
    handlers: {
      onStartShouldSetResponder,
      onMoveShouldSetResponder,
      onResponderGrant,
      onResponderReject,
      onResponderMove,
      onResponderRelease,
      onResponderTerminationRequest,
      onResponderTerminate,
    },
  }))
    .combineLatest(click$, (props, click) => ({ ...props, click }))
    .combineLatest(position$, (props, position) => ({ ...props, position }))
});
