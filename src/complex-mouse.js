// https://codepen.io/HunorMarton/post/handling-complex-mouse-and-touch-events-with-rxjs
/* Import { createStore, combineReducers } from 'redux' */
const { createStore, combineReducers } = Redux;

/* Import { connect, Provider } from 'react-redux' */
const { connect, Provider } = ReactRedux;

/*********
* RxJS utility
**********/
const util = (() => {
  /* Using RxJS for creating new aggregated events for complex user interactions,
   * like vertical / horizontal swipes, short clicks and hold than drag events
   * on a single DOM item based on the basic mouse and touch events.
   */
  function getDragObservables(domItem) {
    const preventDefault = event => {
      if(event.target.tagName !== "INPUT" && event.target.tagName !== "TEXTAREA") event.preventDefault();
    }
    const mouseEventToCoordinate = mouseEvent => {
      preventDefault(mouseEvent);
      return {x: mouseEvent.clientX, y: mouseEvent.clientY};
    };
    const touchEventToCoordinate = touchEvent => {
      preventDefault(touchEvent);
      return {x: touchEvent.changedTouches[0].clientX, y: touchEvent.changedTouches[0].clientY};
    };

    let mouseDowns = Rx.Observable.fromEvent(domItem, "mousedown").map(mouseEventToCoordinate).do(() => console.log('mouse down'));
    let mouseMoves = Rx.Observable.fromEvent(window, "mousemove").map(mouseEventToCoordinate).do(() => console.log('mouse move'));
    let mouseUps = Rx.Observable.fromEvent(window, "mouseup").map(mouseEventToCoordinate).do(() => console.log('mouse up'));

    let touchStarts = Rx.Observable.fromEvent(domItem, "touchstart").map(touchEventToCoordinate).do(() => console.log('touch start'));
    let touchMoves = Rx.Observable.fromEvent(domItem, "touchmove").map(touchEventToCoordinate).do(() => console.log('touch move'));
    let touchEnds = Rx.Observable.fromEvent(window, "touchend").map(touchEventToCoordinate).do(() => console.log('touch end'));
    let touchCancels = Rx.Observable.fromEvent(window, "touchcancel").map(touchEventToCoordinate).do(() => console.log('touch cancel'));

    let _starts = mouseDowns.merge(touchStarts);
    let _moves = mouseMoves.merge(touchMoves);
    let _ends = mouseUps.merge(touchEnds).merge(touchCancels);

    const HOLDING_PERIOD = 600; // milliseconds

    // Clicks: Take the start-end pairs only if no more than 3 move events happen in between, and the end event is within the holding period
    let clicks = _starts.concatMap(dragStartEvent =>
      _ends.first()
        .takeUntil(_moves.elementAt(3))
        .takeUntil(Rx.Observable.timer(HOLDING_PERIOD))
        .do(() => console.log('click'))
        .catch(err => Rx.Observable.empty())
    );

    // Holds: Take those starts where no end event and no more than 3 move event occurs during the holding period
    let holds = _starts.concatMap(dragStartEvent =>
      Rx.Observable.timer(HOLDING_PERIOD)
        .takeUntil(_moves.elementAt(3))
        .takeUntil(_ends)
        .map(() => ({x: dragStartEvent.x, y: dragStartEvent.y}))
        .do(() => console.log('hold'))
        .catch(err => Rx.Observable.empty())
    );

    // Move starts with direction: Pair the move start events with the 3rd subsequent move event,
    // but only if it happens during the holdign period and no end event happens in between
    let moveStartsWithDirection = _starts.concatMap(dragStartEvent =>
      _moves
        .takeUntil(_ends)
        .takeUntil(Rx.Observable.timer(HOLDING_PERIOD))
        .elementAt(3)
        .catch(err => Rx.Observable.empty())
        .map(dragEvent => {
          const intialDeltaX = dragEvent.x - dragStartEvent.x;
          const initialDeltaY = dragEvent.y - dragStartEvent.y;
          return {x: dragStartEvent.x, y: dragStartEvent.y, intialDeltaX, initialDeltaY};
        })
    );

    // Vertical move starts: Keep only those move start events where the 3rd subsequent move event is rather vertical than horizontal
    let verticalMoveStarts = moveStartsWithDirection.filter(dragStartEvent =>
      Math.abs(dragStartEvent.intialDeltaX) < Math.abs(dragStartEvent.initialDeltaY)
    ).do(() => console.log('vertical move starts'));

    // Horizontal move starts: Keep only those move start events where the 3rd subsequent move event is rather horizontal than vertical
    let horizontalMoveStarts = moveStartsWithDirection.filter(dragStartEvent =>
      Math.abs(dragStartEvent.intialDeltaX) >= Math.abs(dragStartEvent.initialDeltaY)
    ).do(() => console.log('horizontal move starts'));

    // Take the moves until an end occurs
    const movesUntilEnds = dragStartEvent =>
      _moves.takeUntil(_ends).map(dragEvent => {
        const x = dragEvent.x - dragStartEvent.x;
        const y = dragEvent.y - dragStartEvent.y;
        return {x, y};
      });

    let verticalMoves = verticalMoveStarts.concatMap(movesUntilEnds).do(() => console.log('vertical move'));
    let horizontalMoves = horizontalMoveStarts.concatMap(movesUntilEnds).do(() => console.log('horizontal move'));
    let dragMoves = holds.concatMap(movesUntilEnds).do(() => console.log('dragging'));

    const lastMovesAtEnds = dragStartEvent =>
      _ends.first().map(dragEndEvent => {
        console.log(dragStartEvent, dragEndEvent);
        const x = dragEndEvent.x - dragStartEvent.x;
        const y = dragEndEvent.y - dragStartEvent.y;
        return {x, y};
      });

    let ends = _starts.concatMap(lastMovesAtEnds);
    let verticalMoveEnds = verticalMoveStarts.concatMap(lastMovesAtEnds).do(() => console.log('vertical move end'));
    let horizontalMoveEnds = horizontalMoveStarts.concatMap(lastMovesAtEnds).do(() => console.log('horizontal move end'));
    let dragMoveEnds = holds.concatMap(lastMovesAtEnds).do(() => console.log('dragging end'));

    return {
      clicks, holds,
      verticalMoveStarts, horizontalMoveStarts,
      verticalMoves, horizontalMoves,
      verticalMoveEnds, horizontalMoveEnds,
      dragMoves, dragMoveEnds
    };
  }

  return {getDragObservables};
})();

/*********
* REACT: List
**********/
const List = (() => {
  class UnconnectedList extends React.Component {
    constructor({id, title, color, edited}) {
      super({id, title, color, edited});

      this.state = {
        y: 0,
        newItemTitle: 'Pull to Create Item',
        fakeInputVisibile: false
      };

      this.newItemId = 0;
      this.itemHeight = 52;

      this.slideBack = this.slideBack.bind(this);
      this.slideToEdit = this.slideToEdit.bind(this);
      this.onFakeInputBlur = this.onFakeInputBlur.bind(this);
    }

    slideBack() {
      let lastTime = null;

      const slideBackAnimation = (time => {
        let y = null;
        if(lastTime !== null) {
          const delta = (time - lastTime) * 0.3;
          if(this.state.y > 0) {
            y = Math.max(0, this.state.y - delta);
          }else{
            y = Math.min(0, this.state.y + delta);
          }
          this.setState({y});
        }
        lastTime = time;
        if(y !== 0) requestAnimationFrame(slideBackAnimation);
      }).bind(this);

      requestAnimationFrame(slideBackAnimation)
    }

    slideToEdit() {
      let lastTime = null;

      const slideToEditAnimation = ((resolve, reject, time) => {
        let y = this.state.y;
        if(lastTime !== null) {
          const delta = (time - lastTime) * 0.7;
          y = Math.max(this.itemHeight, this.state.y - delta);
          this.setState({y});
        }
        console.log(y);
        lastTime = time;
        if(y > this.itemHeight) {
          requestAnimationFrame((time) => {slideToEditAnimation(resolve, reject, time)});
        }else{
          this.setState({y: 0});
          resolve();
        }
      }).bind(this);

      return new Promise((resolve, reject) => {
        requestAnimationFrame((time) => {
          slideToEditAnimation(resolve, reject, time)
        });
      });
    }

    onFakeInputBlur() {
      this.setState({fakeInputVisibile: false});
    }

    render() {
      const newItemRotate = Math.max(0, Math.min(90, Math.asin(-Math.min(this.itemHeight, this.state.y)/this.itemHeight)/Math.PI*180+90));
      const fakeInput = this.state.fakeInputVisibile ? (
        <input
          /* The fake input's role is to force the keyboard to show up on mobile devices.
          * On mobile devices the focus can only be set to an input field from code if:
          * - the focus method is called as a direct result of a user interaction or
          * - the keyboard is already shown.
          * In this case the user interaction happens to be in this component therefore,
          * the focus can be set here, but the item desired focus is two components deep,
          * so the focus is set for the fake input to force the keyboard to show up,
          * then reset by the real input field once the keyboard is already there.
          */
          id='fakeInput' type='text'
          ref={(fakeInput) => { this.fakeInput = fakeInput; }}
          onBlur={this.onFakeInputBlur}/>
      ) : '';
      return (
        <div id='container'>
          <div
            id='list'
            style={{top: Math.min(0, this.state.y)}}
            ref={(draggable) => { this.draggable = draggable; }} >

            <div id='newItemPerspective' style={{height: Math.max(0, this.state.y)}}>
              <div id='newItem' style={{ transform: `rotateX(${newItemRotate}deg)`}}>
                {fakeInput}
                <Item
                  key={this.newItemId} id={this.newItemId}
                  title={this.state.newItemTitle} color={this.props.colors[0]}/>
              </div>
            </div>
            {this.props.items.map((item, index) =>
              <Item
                key={item.id} id={item.id}
                title={item.title} color={this.props.colors[index]}
                edit_mode={this.props.edit_mode}
                edited={this.props.edited_item === item.id || this.props.edited_item === 'FIRST' && index === 0}/>
            )}
          </div>
        </div>
      );
    }

    componentDidMount() {
      const observables = util.getDragObservables(this.draggable);

      observables.verticalMoves.forEach(coordinate => {
        if(this.props.edit_mode === false) {
          if(coordinate.y > this.itemHeight) {
            this.setState({
              newItemTitle: 'Release to Create Item',
              y: coordinate.y
            });
          }else{
            this.setState({
              newItemTitle: 'Pull to Create Item',
              y: coordinate.y
            });
          }

        }
      });

      observables.verticalMoveEnds.forEach(coordinate => {
        if(this.props.edit_mode === false) {
          if(coordinate.y > this.itemHeight) {
            this.setState({
              newItemTitle: '',
              fakeInputVisibile: true
            });
            this.fakeInput.focus();
            this.slideToEdit()
              .then(this.props.appendTop);
          }else {
            this.slideBack();
          }
        }
      });
    }
  }

  const listMapStateToProps = (state, ownProps) => {
    return {
      items: state.items,
      colors: state.colors,
      edit_mode: state.edit.edit_mode,
      edited_item: state.edit.edited_item
    }
  }

  const listMapDispatchToProps = (dispatch, ownProps) => {
    return {
      appendTop: () => {
        dispatch({ type: 'APPEND_TOP' })
      },
    }
  }
  return connect(listMapStateToProps, listMapDispatchToProps)(UnconnectedList);
})();

/*********
* REACT: Item
**********/
const Item = (() => {
  class UnconnectedItem extends React.Component {
    constructor({id, title, color, edit_mode, edited}) {
      super({id, title, color, edit_mode, edited});

      this.state = {
        x: 0,
        height: 'auto',
        dragging: false,
        shrinking: false
      };

      this.itemHeight = 52;
      this.relativePosition = 0; // Relative position of the item during rearrange
      this.terminate = false;

      this.slideBack = this.slideBack.bind(this);
      this.slideDone = this.slideDone.bind(this);
      this.slideDelete = this.slideDelete.bind(this);
      this.shrink = this.shrink.bind(this);
      this.done = this.done.bind(this);
      this.delete = this.delete.bind(this);
    }

    slideBack() {
      let lastTime = null;

      const slideBackAnimation = (time => {
        let x = null;
        if(lastTime !== null) {
          const delta = (time - lastTime) * 0.3;
          if(this.state.x > 0) {
            x = Math.max(0, this.state.x - delta);
          }else{
            x = Math.min(0, this.state.x + delta);
          }
          this.setState({x});
        }
        lastTime = time;
        if(x !== 0) requestAnimationFrame(slideBackAnimation);
      }).bind(this);

      requestAnimationFrame(slideBackAnimation)
    }

    slideDone() {
      let lastTime = null;

      const slideDoneAnimation = ((resolve, reject, time) => {
        let x = null;
        if(lastTime !== null) {
          const delta = (time - lastTime) * 1;
          x = this.state.x + delta;
          this.setState({x});
        }
        lastTime = time;
        if(x < 375) {
          requestAnimationFrame((time) => {
            slideDoneAnimation(resolve, reject, time);
          });
        }else{
          resolve();
        }
      }).bind(this);

      return new Promise((resolve, reject) => {
        requestAnimationFrame((time) => {
          slideDoneAnimation(resolve, reject, time)
        });
      });
    }

    slideDelete() {
      let lastTime = null;

      const slideDeleteAnimation = ((resolve, reject, time) => {
        let x = null;
        if(lastTime !== null) {
          const delta = (time - lastTime) * 1;
          x = this.state.x - delta;
          this.setState({x});
        }
        lastTime = time;
        if(x > -375) {
          requestAnimationFrame((time) => {
            slideDeleteAnimation(resolve, reject, time);
          });
        }else{
          resolve();
        }
      }).bind(this);

      return new Promise((resolve, reject) => {
        requestAnimationFrame((time) => {
          slideDeleteAnimation(resolve, reject, time);
        });
      });
    }

    shrink() {
      this.setState({
        shrinking: true,
        height: parseInt(getComputedStyle(this.draggable).getPropertyValue('height'))
      });

      let lastTime = null;

      const shrinkAnimation = ((resolve, reject, time) => {
        let height = this.state.height;
        if(lastTime !== null) {
          const delta = (time - lastTime) * 0.5;
          height = Math.max(0, this.state.height - delta);
          this.setState({height});
        }
        lastTime = time;
        if(height > 0) {
          requestAnimationFrame((time) => {
            shrinkAnimation(resolve, reject, time)
          });
        }else{
          resolve();
        }
      }).bind(this);

      return new Promise((resolve, reject) => {
        requestAnimationFrame((time) => {
          shrinkAnimation(resolve, reject, time);
        });
      });
    }

    done() {
      this.props.done(this.props.id);
    }

    delete() {
      this.props.delete(this.props.id);
    }

    render() {
      const itemContent = this.props.edited !== true ?
            this.props.title :
            <ItemInput id={this.props.id} title={this.props.title} />
      return (
        <div className={"item" + (this.state.dragging === true ? " draggedItem" : "")}
          style={{
            backgroundColor: this.props.color,
            left: this.state.x,
            top: this.state.y,
            height: this.state.height,
            minHeight: (this.state.shrinking ? 0 : this.itemHeight),
            opacity: (this.props.edit_mode === true && this.props.edited === false ? 0.3 : 1)
          }}
          ref={(draggable) => { this.draggable = draggable; }} >
          <div className="itemTitle">
            {itemContent}
          </div>
        </div>
      );
    }

    componentDidMount() {
      const observables = util.getDragObservables(this.draggable);

      observables.holds.forEach(() => {
        this.relativePosition = 0;
        this.setState({dragging: true});
      });

      observables.dragMoves.forEach(coordinate => {
        if(this.props.edit_mode === false) {

          let y = coordinate.y - this.relativePosition * this.itemHeight;
          if(y > this.itemHeight) {
            this.relativePosition++;
            this.props.moveDown(this.props.id);
          }else if(y < - this.itemHeight) {
            this.relativePosition--;
            this.props.moveUp(this.props.id);
          }
          y = coordinate.y - this.relativePosition * this.itemHeight;
          this.setState({x: coordinate.x/2, y});
        }
      });

      observables.dragMoveEnds.forEach(coordinate => {
        this.setState({
          x: 0,
          y: 0,
          dragging: false
        });
      });

      observables.clicks.forEach(() => {
        if(this.props.edit_mode === false) {
          this.props.editModeOn(this.props.id);
        }else if(this.props.edited === false) {
          this.props.editModeOff();
        }
      });

      observables.horizontalMoves.forEach(coordinate => {
        if(this.props.edit_mode === false) {
          this.setState({x: coordinate.x});
        }
      });

      observables.horizontalMoveEnds.forEach(coordinate => {
        if(this.props.edit_mode === false) {
          if(coordinate.x > 40) {
            this.slideDone()
              .then(this.shrink)
              .then(this.done);
          }else if(coordinate.x < - 40) {
            this.slideDelete()
              .then(this.shrink)
              .then(this.delete);
          }else {
            this.slideBack();
          }
        }
      });
    }

    componentDidUpdate() {
      if(this.terminate === false && this.props.edit_mode === false && this.props.title === '') {
        this.terminate = true;
        this.slideDelete()
          .then(this.shrink)
          .then(this.delete);
      }
    }
  }

  const itemMapDispatchToProps = (dispatch, ownProps) => {
    return {
      editModeOn: (id) => {
        dispatch({ type: 'EDIT_MODE_ON', id });
      },
      editModeOff: () => {
        dispatch({ type: 'EDIT_MODE_OFF' });
      },
      done: (id) => {
        dispatch({ type: 'DONE', id });
      },
      delete: (id) => {
        dispatch({ type: 'DELETE', id });
      },
      moveUp: (id) => {
        dispatch({ type: 'MOVE_UP', id });
      },
      moveDown: (id) => {
        dispatch({ type: 'MOVE_DOWN', id });
      },
    }
  }
  return connect(null, itemMapDispatchToProps)(UnconnectedItem);
})();

/*********
* REACT: Item Input
**********/
const ItemInput = (() => {
  class UnconnectedItemInput extends React.Component {
    constructor({id, title}) {
      super({id, title});

      this.keyPressed = this.keyPressed.bind(this);
      this.update = this.update.bind(this);
      this.blur = this.blur.bind(this);
    }

    update(event) {
      this.props.update(this.props.id, event.target.value);
    }

    keyPressed(event) {
      if (event.keyCode == 13) {  // Enter / Return key
        this.props.editModeOff();
      }
    }

    blur(event) {
      this.props.editModeOff();
    }

    render() {
      return (
        <input type="text" className="itemInput"
          value={this.props.title}
          onChange={this.update} onKeyDown={this.keyPressed} onBlur={this.blur}
          ref={(input) => { this.input = input; }} />
      );
    }

    componentDidMount() {
      this.input.focus();
      // Unrelated curiosity: How to trigger a touch event from code: https://w3c.github.io/touch-events/#touchevent-interface
    }
  }

  const itemInputMapDispatchToProps = (dispatch, ownProps) => {
    return {
      editModeOff: () => {
        dispatch({ type: 'EDIT_MODE_OFF' });
      },
      update: (id, title) => {
        dispatch({ type: 'UPDATE', id, title });
      },
    }
  }
  return connect(null, itemInputMapDispatchToProps)(UnconnectedItemInput);
})();

/*********
* REDUX: Store
**********/
const store = (() => {
  const initialState = {
    items: [
      {id: 1, title: 'Swipe to the right to complete task'},
      {id: 2, title: 'Swipe to the left to delete item'},
      {id: 3, title: 'Pull down to create item'},
      {id: 4, title: 'Tap to edit description'},
      {id: 5, title: 'Hold and drag to rearrange'},
      {id: 6, title: 'Go to the gym'},
      {id: 7, title: 'Buy groceries'},
    ],
    colors: ['#D90015', '#DC1C17', '#DE3A17', '#E25819', '#E4751B', '#E7921B', '#E9AF1D'],
    edit: {
      edit_mode: false,
      edited_item: null
    }
  };

  const itemReducer = (state = initialState.items, action) => {
    switch (action.type) {
      case 'APPEND_TOP': {
        console.log('APPEND TOP');
        const newId = new Date().getTime(); // No, the ID does not have to be the current time, but the current time is sort of unique
        return [{id: newId, title: ''}, ...state];
      }
      case 'DONE': {
        return state.filter(item => item.id !== action.id);
      }
      case 'DELETE': {
        return state.filter(item => item.id !== action.id);
      }
      case 'MOVE_DOWN': {
        console.log('MOVE DOWN', action.id);
        const index = state.findIndex(item => item.id === action.id);
        if(index === state.length - 1) return state;
        return [
          ...state.slice(0, index),
          state[index+1],
          state[index],
          ...state.slice(index+2)
        ];
      }
      case 'MOVE_UP': {
        console.log('MOVE UP', action.id);
        const index = state.findIndex(item => item.id === action.id);
        if(index === 0) return state;
        return [
          ...state.slice(0, index-1),
          state[index],
          state[index-1],
          ...state.slice(index+1)
        ];
      }
      case 'UPDATE': {
        return state.map(item => {
          if(item.id !== action.id) {
            return item; // This isn't the item we care about - keep it as-is
          }
          return { // Otherwise, this is the one we want - return an updated value
            id: action.id,
            title: action.title
          };
        });
      }
      default:
        return state;
      }
  };

  const colorReducer = (state = initialState.colors, action) => {
    //https://gist.github.com/rosszurowski/67f04465c424a9bc0dae
    const lerpColor = (a, b, amount) => {
      var ah = parseInt(a.replace(/#/g, ''), 16),
          ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
          bh = parseInt(b.replace(/#/g, ''), 16),
          br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
          rr = ar + amount * (br - ar),
          rg = ag + amount * (bg - ag),
          rb = ab + amount * (bb - ab);
      return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
    }

    // Generates a range of interpolated colors from color a to b
    const colorRange = (length, a = '#D90015', b = '#E9AF1D') =>
      Array.from({length}, (value, key) => lerpColor(a, b, 1/length*key));

    switch (action.type) {
      case 'APPEND_TOP': {
        return colorRange(state.length + 1);
      }
      case 'DONE':
      case 'DELETE': {
        return colorRange(state.length - 1);
      }
      default:
        return state;
    }
  };

  const editReducer = (state = initialState.edit, action) => {
    switch (action.type) {
      case 'APPEND_TOP': {
        return {
          edit_mode: true,
          edited_item: 'FIRST'
        }
      }
      case 'EDIT_MODE_ON': {
        console.log('EDIT MODE ON', action.id);
        return {
          edit_mode: true,
          edited_item: action.id
        };
      }
      case 'EDIT_MODE_OFF': {
        console.log('EDIT MODE OFF');
        return {
          edit_mode: false,
          edited_item: null
        };
      }
      default:
        return state;
    }
  };

  const mainReducer = combineReducers({
    items: itemReducer,
    colors: colorReducer,
    edit: editReducer
  });

  return createStore(mainReducer);
})();

/*********
* REACT DOM
**********/
ReactDOM.render(
  <Provider store={store}>
    <List />
  </Provider>,
  document.getElementById('content')
);
