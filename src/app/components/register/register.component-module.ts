import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { RegisterComponent } from './register.component';

@NgModule({
  imports: [ReactiveFormsModule, MatInputModule, CommonModule],
  declarations: [RegisterComponent],
  providers: [],
  exports: [RegisterComponent],
})
export class RegisterComponentModule {}
