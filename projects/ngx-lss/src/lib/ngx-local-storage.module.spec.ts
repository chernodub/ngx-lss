import { Component, NgModule } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { NgxLocalStorageModule } from './ngx-local-storage.module';
import { NgxLocalStorageService } from './ngx-local-storage.service';

@Component({ template: '<router-outlet></router-outlet>' })
export class DummyRootComponent {}

@Component({ template: '' })
export class LazyDummyComponent {}

@NgModule({
  declarations: [],
  imports: [
    NgxLocalStorageModule.forRoot(),
    RouterModule.forChild([{ path: '', pathMatch: 'full', component: LazyDummyComponent }]),
  ],
})
export class LazyDummyModule {}

describe('NgxLocalStorageModule', () => {
  describe('without `forRoot` call', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NgxLocalStorageModule],
      });
    });

    it('throws an error', () => {
      expect(() => TestBed.inject(NgxLocalStorageService)).toThrow()
    });
  });

  describe('with `forRoot` call', () => {
    describe('when imported once', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [NgxLocalStorageModule.forRoot()],
        });
      });

      it('injects service', () => {
        expect(TestBed.inject(NgxLocalStorageService)).toBeTruthy();
      });
    });

    describe('when imported more than once', () => {
      let router: Router;

      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [DummyRootComponent],
          imports: [
            NgxLocalStorageModule.forRoot(),
            RouterTestingModule.withRoutes([
              {
                path: '',
                pathMatch: 'full',
                loadChildren: () => Promise.resolve(LazyDummyModule),
              },
            ]),
          ],
        });

        router = TestBed.inject(Router);
      });

      // Using `fakeAsync()` and `tick()` to wait for the router to initialize the lazy module
      it('throws an error on module initialization', fakeAsync(() => {

        expect(() => {
          router.initialNavigation();
          tick();
        }).toThrowError();
      }));
    });
  });
});
