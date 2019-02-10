# NgxSubscribe

This project derives from Natanel Basel's excellent article,
"<a href="https://netbasal.com/diy-subscription-handling-directive-in-angular-c8f6e762697f" 
target="_blank">DIY Subscription Handling Directive in Angular</a>".

The code is based on his `ngsubscribe-full` version, downloaded from StackBlitz on 9 Feb 2019.

This version differs in that
* using `ngx` prefix instead of `ng`, which is reserved by Angular itself

* corrects the bug that caused the  `*ngSubscribe="someObject"' variant to fail and extends that variant to support non-observable properties.

* handles the single observable variant (`*ngSubscribe="someObservable as foo"').

* handles null/missing observable

* Less frequent need to check if the subscribed variable is null/undefined.

## What matters

Everything and the only thing of real interest is in the `ngx-subscribe.directive.ts`. 
The rest is just the demo program that demonstrates it.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.
