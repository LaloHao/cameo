import { Observable } from 'rxjs/Rx';
import { setObservableConfig } from 'recompact';

setObservableConfig({
  fromESObservable: Observable.from
});
