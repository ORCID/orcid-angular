import { storiesOf } from '@storybook/angular'
import { MatIconModule } from '@angular/material/icon'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatInputModule } from '@angular/material/input'
import mockAutocomplete from '../../.mockData/mock-autocomplete.json'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { action } from '@storybook/addon-actions'

storiesOf('Components|Autocomplete', module).add(
  'Plain',
  () => ({
    template: `
        <mat-form-field appearance="outline">
            <mat-label
              >Organization's name</mat-label
            >
            <input
              matInput
              aria-label="Institution"
              [matAutocomplete]="auto"
            />
            <mat-autocomplete
              autoActiveFirstOption
              #auto="matAutocomplete"
              (optionSelected)="selected($event)"
            >
              <mat-option
                *ngFor="let option of filteredOptions"
                [value]="option"
              >
                {{ option }}
              </mat-option>
            </mat-autocomplete>
            <button
              mat-button
              matSuffix
              mat-icon-button
              aria-label="Autocomplete"
              (click)="clear()"
            >
              <mat-icon>close</mat-icon>
            </button>
          </mat-form-field>
    `,
    moduleMetadata: {
      imports: [
        BrowserAnimationsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatIconModule,
      ],
    },
    props: {
      filteredOptions: mockAutocomplete,
      selected: action(`log`),
      clear: action(`log`),
    },
  }),
  {
    notes: {
      markdown: `Display a list of results`,
    },
  }
)
