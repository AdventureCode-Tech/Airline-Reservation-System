import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SITE } from '../../../core/site.constants';

@Component({
  selector: 'app-live-support-banner',
  imports: [RouterLink],
  templateUrl: './live-support-banner.component.html',
})
export class LiveSupportBannerComponent {
  readonly site = SITE;
}
