import {
  Directive,
  OnInit,
  OnDestroy,
  Input,
  TemplateRef,
  ViewContainerRef,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Directive({ selector: '[hasRole]' })
export class HasRoleDirective implements OnInit, OnDestroy {
  @Input() hasRole: string | null = null;

  @Input()
  set hasRoleElse(templateRef: TemplateRef<any> | null) {
    this.elseTpl = templateRef;
  }

  private elseTpl: TemplateRef<any> | null = null;
  private _onDestroy$ = new Subject<void>();

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    private _authService: AuthService
  ) {}

  ngOnInit() {
    this._authService
      .hasRole(this.hasRole as string)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((hasRole: boolean) => {
        this.viewContainer.clear();

        if (hasRole) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          if (this.elseTpl) {
            this.viewContainer.createEmbeddedView(this.elseTpl);
          }
        }
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }
}
