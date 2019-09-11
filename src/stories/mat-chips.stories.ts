import { storiesOf } from '@storybook/angular'
import { MatButtonModule, MatChipsModule } from '@angular/material'
import { action } from '@storybook/addon-actions'

storiesOf('Material Buttons', module).add('Plain', () => ({
  template: `
    <h1 id="Material Chips" id="title">Material Chips</h1>
    <mat-chip-list
      aria-labelledby="title"
      (change)="matChipListChange($event)"
      multiple="true"
    >
      <mat-chip
        color="primary"
        selected
        #second="matChip"
        (click)="second.toggleSelected(true)"
        >Primary</mat-chip
      >
      <mat-chip
        color="accent"
        selected
        #third="matChip"
        (click)="third.toggleSelected(true)"
        >Accent</mat-chip
      >
      <mat-chip
        color="warn"
        selected
        #fourth="matChip"
        (click)="fourth.toggleSelected(true)"
        >Warm</mat-chip
      >
      <mat-chip
        color="Outlined"
        selected
        class="orcid-outline-chip"
        color="primary"
        #fifth="matChip"
        (click)="fifth.toggleSelected(true)"
        >Primary</mat-chip
      >
    </mat-chip-list>
    `,

  props: {
    matChipListChange: action('log'),
  },
  moduleMetadata: {
    imports: [MatChipsModule],
  },
}))
// .add('Custom outline', () => ({
//   template: ``,
//   moduleMetadata: {
//     imports: [MatChipsModule],
//   },
// }))
