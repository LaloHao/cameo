import React from 'react';
// import { PanResponder } from 'react-native';

import {
  mapPropsStream,
  createEventHandler,
} from 'recompact';

// export const withPanResponder = mapPropsStream(props$ => {
//   const { handler: responderMove, stream: onResponderMove$ } = createEventHandler();

//   const position$ = onResponderMove$
//         // .startWith({ x: 0, y: 0 })
//         .throttleTime(100)
//         .map(e => ({ x: e.nativeEvent.pageX, y: e.nativeEvent.pageY }));

//   return props$
//     .map(props => ({ ...props, responderMove }))
//     .combineLatest(position$, (props, position) => ({ ...props, ...position }));
// });

// const nativeEvent = {
//   preventDefault: () => null,
//   stopPropagation: () => null,
//   stopImmediatePropagation: () => null,
// };

// export const withPanResponder = mapPropsStream(props$ => {
//   const { handler: onDrag, stream: onDrag$ } = createEventHandler();

//   const event$ = onDrag$
//     .startWith({ nativeEvent })
//     .throttleTime(100)
//     .map(({ nativeEvent: e }) => {
//       e.preventDefault();
//       e.stopPropagation();
//       e.stopImmediatePropagation();
//       return { nativeEvent: e };
//     });

//   return props$
//     .map(props => ({
//       ...props,
//       // onStartShouldSetResponder: () => true,
//       // onResponderRelease: () => true,
//       onDrag,
//     }))
//     .combineLatest(event$, (props, event) => ({ ...props, drag: event }));
// });

// export const
