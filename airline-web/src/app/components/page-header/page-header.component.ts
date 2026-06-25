import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  imports: [],
  template: `<header><h1>{{ title() }}</h1></header>`,
  styles: `
    header {
      margin-bottom: 1.5rem;
    }

    h1 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 600;
    }
  `,
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
}
