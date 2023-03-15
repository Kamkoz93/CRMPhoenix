import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _isLoadingSubject: Subject<boolean> = new Subject<boolean>();
  public isLoading$: Observable<boolean> =
    this._isLoadingSubject.asObservable();

  constructor() {}

  show() {
    this._isLoadingSubject.next(true);
  }

  hide() {
    this._isLoadingSubject.next(false);
  }
}
