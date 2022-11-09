import { Inject, InjectionToken, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { NgxLocalStorageService } from './ngx-local-storage.service';

export const FORROOT_GUARD_TOKEN = new InjectionToken<void>('ROUTER_FORROOT_GUARD');

type GuardedResult = boolean;

const MULTIPLE_FORROT_IMPORTS_ERROR =
  `The NgxLocalStorageModule was imported more than once. This could happen if 'forRoot' is used outside of the root injector.`;
const INITIALIZED_WITHOUT_FORROOT_ERROR = `NgxLocalStorageModule must be imported via 'forRoot()' call in your root module.`;

/**
 * Module providing local storage adapter service.
 * Must be imported once via static `forRoot()` method in order to prevent possible issues with multiple instances of the storage service.
 */
@NgModule()
export class NgxLocalStorageModule {

  public constructor(
  @Optional() @Inject(FORROOT_GUARD_TOKEN) guarded: GuardedResult,
  ) {
    if (!guarded) {
      throw new Error(INITIALIZED_WITHOUT_FORROOT_ERROR);
    }
  }

  /**
   * Initializes the module for root.
   */
  public static forRoot(): ModuleWithProviders<NgxLocalStorageModule> {
    return {
      ngModule: NgxLocalStorageModule,
      providers: [
        NgxLocalStorageService,

        // Borrowed the idea from
        // https://github.com/angular/angular/blob/main/packages/router/src/router_module.ts#L179
        {
          provide: FORROOT_GUARD_TOKEN,
          useFactory: provideForRootGuard,
          deps: [[NgxLocalStorageService, new Optional(), new SkipSelf()]],
        },
      ],
    };
  }

}

/**
 * Makes sure that the module is only injected once.
 * @param service Service instance.
 */
export function provideForRootGuard(service: NgxLocalStorageService): GuardedResult {
  if (service) {
    throw new Error(MULTIPLE_FORROT_IMPORTS_ERROR);
  }
  return true;
}
