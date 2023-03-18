import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ROUTES_DEF } from 'src/app/configuration/routes-definition';

@Component({
  selector: 'app-logged-out',
  templateUrl: './logged-out.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoggedOutComponent {
  public readonly urlRoutes = ROUTES_DEF;
}
