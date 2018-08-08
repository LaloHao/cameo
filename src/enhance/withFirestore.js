import React, { createFactory } from 'react';
import { Subject } from 'rxjs/Rx'
import store from 'store';

import {
  mapPropsStream,
  componentFromStream,
  mapProps,
  compose,
  withProps,
  setDisplayName,
  wrapDisplayName,
} from 'recompact';

const data = snapshot => snapshot.data();
const exists = snapshot => snapshot.exists;
const document = snapshot => exists(snapshot) && data(snapshot);
const documents = snapshot => snapshot.docs;

const Query = Query => props$ => {
  let id = 'result';
  const value$ = new Subject();
  const query$ = props$
    .map(props => Query(props))
    .do(({
      collection,
      doc,
      where,
      id: _id,
    }) => {
      id = _id;
      let query = store.collection(collection);
      if (doc) {
        query = query.doc(doc);
      } else if (where) {
        query = query.where(...where);
      }
      if (doc) {
        query.onSnapshot(snapshot => value$.next(document(snapshot)));
      }
      query.onSnapshot(snapshot => value$.next(documents(snapshot)));
    });

  return props$
    .combineLatest(query$, props => props)
    .combineLatest(value$, (props, value) => ({
      ...props,
      store: {
        ...props.store,
        [id]: value,
      },
    }))
};

const withFirestore = query => mapPropsStream(Query(query));

export default withFirestore;
