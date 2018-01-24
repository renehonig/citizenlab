import * as Rx from 'rxjs/Rx';
import { isObject, isEmpty, has } from 'lodash';

// utils
import shallowCompare from 'utils/shallowCompare';

// typings
import { IOption, ImageFile } from 'typings';
import { setTimeout } from 'timers';

export interface IIdeasNewPageGlobalState {
  title: string | null;
  description: string | null;
  selectedTopics: IOption[] | null;
  selectedProject: IOption | null;
  position: string;
  position_coordinates: GeoJSON.Point | null;
  submitError: boolean;
  processing: boolean;
  ideaId: string | null;
  imageFile: ImageFile[] | null;
  imageId: string | null;
  imageChanged: boolean;
}

export type IAdminFullWidth = {
  enabled: boolean;
};

type State = {
  IdeasNewPage?: IIdeasNewPageGlobalState;
  AdminFullWidth?: IAdminFullWidth;
};

interface IStateInput {
  propertyName: keyof State;
  updatedStateProperties: object;
}

interface IStream<T> {
  observer: Rx.Observer<T>;
  observable: Rx.Observable<T>;
}

export interface IGlobalStateService<T> {
  observable: Rx.Observable<T>;
  set: (newState: Partial<T>) => void;
  get: () => Promise<T>;
}

class GlobalState {
  private stream: IStream<any>;

  constructor() {
    this.stream = {
      observer: null as any,
      observable: null as any
    };

    this.stream.observable = new Rx.Observable<State>((observer) => {
      this.stream.observer = observer;
    })
    .startWith({})
    .scan((oldState: State, stateInput: IStateInput) => {
      const { propertyName, updatedStateProperties } = stateInput;

      const newState =  {
        ...oldState,
        [propertyName]: {
          ...oldState[propertyName],
          ...updatedStateProperties
        }
      };

      return newState;
    })
    .filter(state => isObject(state) && !isEmpty(state))
    // .distinctUntilChanged((oldState, newState) => shallowCompare(oldState, newState))
    .publishReplay(1)
    .refCount();

    // keep stream hot
    this.stream.observable.subscribe();
  }

  init<T>(propertyName: keyof State, initialState?: T) {
    const observable: Rx.Observable<T> = this.stream.observable
      .map(state => state[propertyName])
      .filter(filteredState => isObject(filteredState) && !isEmpty(filteredState))
      .distinctUntilChanged((filteredState, newFilteredState) => shallowCompare(filteredState, newFilteredState));

    const set = (newState: Partial<T>) => this.set(propertyName, newState);

    const get = () => this.get<T>(propertyName);

    if (initialState && isObject(initialState) && !isEmpty(initialState)) {
      if (!this.stream.observer) {
        setTimeout(() => set(initialState), 0);
      } else {
        set(initialState);
      }
    }

    return {
      observable,
      set,
      get
    } as IGlobalStateService<T>;
  }

  set<T>(propertyName: keyof State, updatedStateProperties: Partial<T>) {
    const stateInput: IStateInput = {
      propertyName,
      updatedStateProperties
    };

    this.stream.observer.next(stateInput);
  }

  get<T>(propertyName: keyof State) {
    return this.stream.observable.map((state) => {
      return has(state, propertyName) ? state[propertyName] : null;
    }).first().toPromise() as Promise<T>;
  }
}

export const globalState = new GlobalState();
