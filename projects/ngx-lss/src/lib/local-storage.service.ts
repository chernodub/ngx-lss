import { Inject, Injectable } from '@angular/core';
import { defer, filter, fromEvent, map, merge, Observable, of, shareReplay, startWith, Subject } from 'rxjs';

import { WINDOW } from './utils/window-token';

/**
 * Angular adapter for the local storage.
 */
@Injectable()
export class LocalStorageService {
  /** Emits the key of the value changed in the local storage. */
  private readonly valueChangedSubject = new Subject<string>();

  private readonly localStorage: Storage;

  public constructor(
    @Inject(WINDOW) private readonly window: Window,
  ) {
    this.localStorage = this.window.localStorage;
  }

  /**
   * Persists data to local storage by `key`.
   * @param key Unique key.
   * @param data Data for save.
   */
  public save<T>(key: string, data: T): Observable<void> {
    return defer(() => {
      this.localStorage.setItem(key, JSON.stringify(data));
      this.valueChangedSubject.next(key);

      return of(undefined);
    });
  }

  /**
   * Observes item from storage by `key`.
   * @param key Unique key.
   */
  public get<T = unknown>(key: string): Observable<T | null> {
    return this.watchStorageChangeByKey(key).pipe(
      map(() => this.obtainFromStorageByKey<T>(key)),
      startWith(this.obtainFromStorageByKey<T>(key)),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );
  }

  private watchStorageChangeByKey(keyToWatch: string): Observable<void> {
    const otherPageChange$ = fromEvent(this.window, 'storage').pipe(
      filter((event): event is StorageEvent => event instanceof StorageEvent),
      map(event => event.key),
    );

    // storage event happens only for the other pages of this domain, so we need to handle the local changes manually
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
    const currentPageChange$ = this.valueChangedSubject;

    return merge(
      otherPageChange$,
      currentPageChange$,
    ).pipe(
      filter(key => key === keyToWatch),
      map(() => undefined),
    );
  }

  private obtainFromStorageByKey<T = unknown>(key: string): T | null {
    const rawData = this.localStorage.getItem(key);
    if (rawData == null) {
      return null;
    }
    return JSON.parse(rawData) as T;
  }

  /**
   * Removes data from local storage.
   * @param key Key.
   */
  public remove(key: string): Observable<void> {
    return defer(() => {
      this.localStorage.removeItem(key);
      this.valueChangedSubject.next(key);

      return of(undefined);
    });
  }
}
