import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';

import { assertNonNull } from './assert-non-null';

/**
 * Injection token for window object.
 */
export const WINDOW = new InjectionToken<Window>(
  'Global window object',
  {
    factory() {
      const { defaultView } = inject(DOCUMENT);
      assertNonNull(defaultView);
      return defaultView;
    },
  },
);
