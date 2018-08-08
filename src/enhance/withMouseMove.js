import {
  mapPropsStream,
  createEventHandler,
} from 'recompact';

const withMouseMove = mapPropsStream(props$ => {
  const { handler: onMove, stream: onMove$ } = createEventHandler();

  const position$ = onMove$
        .startWith({ x: 0, y: 0 })
        .throttleTime(100)
        .map(e => ({ x: e.clientX, y: e.clientY }));

  return props$
    .map(props => ({ ...props, onMove }))
    .combineLatest(position$, (props, position) => ({ ...props, move: position }));
});

export default withMouseMove;
