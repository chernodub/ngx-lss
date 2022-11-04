import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxLocalStorageService } from './ngx-local-storage.service';

/** Module providing local storage adapter service. */
@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [NgxLocalStorageService],
})
export class NgxLocalStorageModule { }
