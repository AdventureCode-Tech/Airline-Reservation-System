import { Component } from '@angular/core';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  imports: [MainLayoutComponent],
  template: '<app-main-layout />',
})
export class AppComponent {}
