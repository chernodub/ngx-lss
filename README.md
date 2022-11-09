<p align="center"><img height=200 src="https://user-images.githubusercontent.com/37013688/199909362-c2fd546d-e84d-46a8-b023-6a634bbdb483.png" /></p>


<h1 align="center">ngx-lss</h1> 

<p align="center">
  <a href="https://www.npmjs.com/package/ngx-lss"><img src="https://img.shields.io/npm/v/ngx-lss?style=flat-square" alt="NPM Version" /></a>
  <a href="https://github.com/chernodub/ngx-lss/blob/main/LICENSE"><img src="https://img.shields.io/github/license/chernodub/ngx-lss?style=flat-square" alt="GitHub license" /></a>
  <a href="https://github.com/chernodub/ngx-lss/releases/latest"><img alt="Last release date" src="https://img.shields.io/github/release-date/chernodub/ngx-lss?style=flat-square"/></a>
</p>

> `ngx-lss` is an angular library that provides a **reactive adapter for `localStorage` API**

## Features

* 🎆 Provides `Observable` API
* 👀 Allows watching changes made in other tabs
* 🐣 Easily adaptable and replaceable (3 simple methods: `save`, `get`, `remove`)
* 🔬 Fully tested with `jasmine`

## Installation

```bash
npm i ngx-lss
```

## Setting up

1. Import `NgxLocalStorageModule` to root module of your app

  ```typescript
  import { NgxLocalStorageModule } from 'ngx-lss';

  @NgModule({
    // ...
    imports: [
      // ...
      NgxLocalStorageModule.forRoot(),
    ]
  })
  export class AppModule { }
  ```

2. Inject the service in your injectable class

  ```typescript
  import { Component } from '@angular/core';
  import { NgxLocalStorageService } from 'ngx-lss';

  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
  })
  export class AppComponent {
    public constructor(
      private readonly NgxLocalStorageService: NgxLocalStorageService,
   ) {
      // ...
    }
  }
  ```

## Usage examples

### Abstracting the service in a domain specific storage

> 💡 This is a recommended way to use the `ngx-lss` in your applications. It allows you to clearly separate the logic of working with the local storage from the business logic of your application. Also, this way, you can easily replace the library with another storage or your own implementation.


```ts
import { Injectable } from '@angular/core';
import { NgxLocalStorageService } from 'ngx-lss';
import { map, Observable } from 'rxjs';

import { UserSecret } from '../models/user-secret';


const USER_SECRET_STORAGE_KEY = 'user';

@Injectable({ providedIn: 'root' })
export class UserSecretStorageService {
  /** Credential secret of the current user. */
  public readonly currentSecret$: Observable<UserSecret | null>;

  public constructor(
    private readonly storageService: NgxLocalStorageService,
  ) {
    this.currentSecret$ = this.storageService.get<UserSecret>(USER_SECRET_STORAGE_KEY);
  }

  /**
   * Saves secret to the current storage.
   * @param secret Secret to save.
   */
  public saveSecret(
    secret: UserSecret,
  ): Observable<UserSecret> {
    return this.storageService.save(USER_SECRET_STORAGE_KEY, secret).pipe(map(() => secret));
  }

  /** Removes current secret. */
  public removeSecret(): Observable<void> {
    return this.storageService.remove(USER_SECRET_STORAGE_KEY);
  }
}
```

### Accessing the storage API directly from a component

```typescript
import { Component } from '@angular/core';
import { NgxLocalStorageService } from 'ngx-lss';

const COUNTER_KEY = 'counter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /** Clicks counter. */
  public readonly counter$: Observable<number | null>;

  public constructor(
    private readonly storage: NgxLocalStorageService,
  ) {
    this.counter$ = this.storage.get<number>(COUNTER_KEY);
  }

  public onUserClick(): void {
    this.counter$.pipe(
      first(),
      map(counter => counter ?? 0),
      switchMap(counter => this.storage.save(COUNTER_KEY, counter + 1)),
    ).subscribe();
  }
}
```
