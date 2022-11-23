import { fakeAsync, flush } from '@angular/core/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Observer, Subscription } from 'rxjs';

import { NgxLocalStorageService } from './ngx-local-storage.service';

/** Creates observer spy object. */
export function createObserverSpy<T>(): jasmine.SpyObj<Observer<T>> {
  return jasmine.createSpyObj('observer', ['next', 'error', 'complete']);
}

describe('NgxLocalStorageService', () => {
  let spectator: SpectatorService<NgxLocalStorageService>;
  let subs: Subscription[];

  const createService = createServiceFactory({
    service: NgxLocalStorageService,
  });

  beforeEach(() => {
    spectator = createService();
    subs = [];
  });

  afterAll(() => {
    localStorage.clear();
    subs.forEach(sub => sub.unsubscribe());
  });

  describe('.get(x)', () => {
    it('re-emits value in case it\'s changed', fakeAsync(() => {
      const key = 'some-test-key';
      const firstData = { someData: 123 };
      const secondData = { someData: 12345 };
      const resultValues: unknown[] = [];

      spectator.service.save(key, firstData).subscribe();
      subs.push(spectator.service.get(key).subscribe(value => resultValues.push(value)));
      spectator.service.save(key, secondData).subscribe();
      flush();

      expect(resultValues.length).toBe(2);
      expect(resultValues).toContain(firstData);
      expect(resultValues).toContain(secondData);
    }));

    it('should return latest value at the time of subscription', () => {
      const testKey = 'some-key';
      const latestDummyData = { someNewData: 12345 };

      const resultValues: unknown[] = [];

      spectator.service.save(testKey, { someData: 123 }).subscribe();
      const data$ = spectator.service.get(testKey);
      spectator.service.save(testKey, latestDummyData).subscribe();
      data$.subscribe(data => resultValues.push(data));

      expect(resultValues.length).toBe(1);
      expect(resultValues).toContain(latestDummyData);
    });

    it('returns initial null in case storage is empty', () => {
      const key = 'some-non-existent-key';
      const observerSpy = createObserverSpy();

      subs.push(spectator.service.get(key).subscribe(observerSpy));

      expect(observerSpy.next).toHaveBeenCalledOnceWith(null);
      expect(observerSpy.complete).not.toHaveBeenCalled();
      expect(observerSpy.error).not.toHaveBeenCalled();
    });
  });

  describe('.save(x)', () => {
    it('saves to storage', fakeAsync(() => {
      const key = 'some-test-key-1';
      const data = { someData: 123 };
      let state = null;

      subs.push(spectator.service.get<typeof data>(key).subscribe(value => (state = value)));
      flush();
      expect(state).toBeNull();

      spectator.service.save(key, data).subscribe();
      flush();
      expect(state as (typeof data | null)).toEqual(data);
    }));
  });

  describe('.remove(x)', () => {
    it('removes from storage', fakeAsync(() => {
      const key = 'some-test-key-2';
      const data = { someData: 123 };
      let state = null;

      subs.push(spectator.service.get(key).subscribe(value => (state = value)));
      flush();
      expect(state).toBeNull();

      spectator.service.save(key, data).subscribe();
      flush();
      expect(state).not.toBeNull();

      spectator.service.remove(key).subscribe();
      flush();
      expect(state).toBeNull();
    }));
  });
});
