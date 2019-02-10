/**
 * Directive alternative to subscribing with AsyncPipe via *ngIf just to get the data
 * Instead of `<div> *ngIf="data$ | as data> ..."
 * `<div> *ngIf="data$ | as data> ..."
 * Adapted from Natanel Basel ngSubscribe code in article
 * https://netbasal.com/diy-subscription-handling-directive-in-angular-c8f6e762697f
 */
import {
  Directive,
  Input,
  ViewContainerRef,
  TemplateRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { combineLatest, EMPTY, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export class NgxSubscribeContext {
  public $implicit: any = null;
  public ngxSubscribe: any = null;
}

@Directive({
  selector: '[ngxSubscribe]'
})
export class NgxSubscribeDirective implements OnInit, OnDestroy {
  private observable: Observable<any> | Observable<any>[];
  private context: NgxSubscribeContext = new NgxSubscribeContext();
  private subscription: Subscription;

  @Input()
  set ngxSubscribe(inputObservable: Observable<any> | Observable<any>[]) {
    if (this.observable !== inputObservable) {
      this.observable = inputObservable;
      this.subscription && this.subscription.unsubscribe();
      this.context.ngxSubscribe = undefined;

      let innerObservable: Observable<any>;

      if (!inputObservable) {
        innerObservable = EMPTY;
      } else if (Array.isArray(inputObservable)) {
        // assume it is an array of observables.
        // emits only after all observables have emitted once
        innerObservable = combineLatest(inputObservable).pipe(startWith([]));
      } else if (inputObservable.subscribe) {
        // assume it's an observable because it looks like one
        innerObservable = inputObservable;
      } else {
        // assume it is an object with observable properties
        const {result, keys, observables} = Object.keys(inputObservable).reduce((acc, k) => {
          const o = inputObservable[k];
          if (o.subscribe) {
            // assume is observable because looks like one
            acc.observables.push(o);
            acc.keys.push(k);
          } else {
            // assume this property is a static value.
            // will not change, even if you mutate inputObservable[k]
            acc.result[k] = o;
          }
          return acc;
        }, {
          result: {},
          keys: [] as string[],
          observables: [] as Observable<any>[]
        });

        // no observable properties emit until each have emitted once.
        innerObservable = combineLatest(keys.map(k => inputObservable[k])).pipe(
          map(values => keys.reduce((acc, k, i) => {
              acc[k] = values[i];
              return acc;
            }, result)
          ),
          startWith(result)
        );
      }

      this.subscription = innerObservable.subscribe(
        value => {
          this.context.ngxSubscribe = value;
          this.cdr.markForCheck();
        }
      )
    }
  }

  constructor(
    private viewContainer: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    private templateRef: TemplateRef<any>
  ) { }

  ngOnInit() {
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }
}
