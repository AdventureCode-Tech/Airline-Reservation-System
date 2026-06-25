import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SITE } from '../../core/site.constants';
import {
  ABOUT_IMAGES,
  ABOUT_SERVICES,
  ABOUT_VALUES,
  WHY_CHOOSE_US,
} from './about.content';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  readonly site = SITE;
  readonly values = ABOUT_VALUES;
  readonly services = ABOUT_SERVICES;
  readonly whyChoose = WHY_CHOOSE_US;
  readonly images = ABOUT_IMAGES;
}
