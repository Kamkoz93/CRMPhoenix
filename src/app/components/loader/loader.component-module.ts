import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoaderComponent } from './loader.component';

@NgModule({
  imports: [CommonModule],
  declarations: [LoaderComponent],
  providers: [],
  exports: [LoaderComponent],
})
export class LoaderComponentModule {}
