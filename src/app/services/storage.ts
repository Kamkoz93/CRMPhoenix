import { InjectionToken } from '@angular/core';

export const STORAGE = new InjectionToken<Storage>('STORAGE');

export interface Storage {
  getItem(key: string): string | null;

  setItem(key: string, value: string): void;

  removeItem(key: string): void;
}
