import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core'

@Component({
  selector: 'app-trusted-summary-page',
  templateUrl: './trusted-summary-page.component.html',
  styleUrls: ['./trusted-summary-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TrustedSummaryPageComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {}
  ngOnInit(): void {}
}
