import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSelectModule } from '@angular/material/select'
import { MatTooltipModule } from '@angular/material/tooltip'
import { HeaderBannerComponent } from '@orcid/ui'

@Component({
  selector: 'orcid-record-header-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderBannerComponent,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  styleUrls: ['./record-header-page.component.scss'],
  template: `
    <h2>Header banner</h2>
    <p>
      The <code>HeaderBannerComponent</code> renders a responsive header layout
      given a generic title, identifier text and expansion state. The app
      container is responsible for fetching data, composing feature strings, and
      wiring state from services.
    </p>

    <section class="docs-section controls-panel">
      <h3>Controls</h3>
      <p>Modify these values to see how they affect all examples below:</p>
      <div class="controls-grid">
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput [(ngModel)]="config.title" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Subtitle</mat-label>
          <input
            matInput
            [(ngModel)]="config.subtitle"
            [disabled]="!config.showSubtitle"
          />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Primary ID Text</mat-label>
          <input matInput [(ngModel)]="config.primaryIdText" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Secondary ID Text</mat-label>
          <input matInput [(ngModel)]="config.secondaryIdText" />
        </mat-form-field>

        <mat-checkbox [(ngModel)]="config.showSubtitle">
          Show Subtitle
        </mat-checkbox>

        <mat-checkbox [(ngModel)]="config.canToggleExpanded">
          Can Toggle Expanded
        </mat-checkbox>

        <mat-checkbox [(ngModel)]="config.expanded">
          Expanded (initial state)
        </mat-checkbox>

        <mat-form-field appearance="outline">
          <mat-label>Region Names</mat-label>
          <input matInput [(ngModel)]="config.regionNames" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Region ORCID ID</mat-label>
          <input matInput [(ngModel)]="config.regionOrcidId" />
        </mat-form-field>
      </div>
    </section>

    <section class="docs-section">
      <h3>Examples</h3>
      <p>Different combinations of compact mode and viewport size:</p>

      <div class="example-group">
        <h4>Desktop View - Normal Mode</h4>
        <div class="example-container desktop">
          <orcid-header-banner
            class="orcid-theme"
            [loading]="false"
            [compactMode]="false"
            [isDesktop]="true"
            [title]="config.title"
            [subtitle]="config.showSubtitle ? config.subtitle : ''"
            [primaryIdText]="config.primaryIdText"
            [secondaryIdText]="config.secondaryIdText"
            [expanded]="config.expanded"
            [canToggleExpanded]="config.canToggleExpanded"
            (expandedChange)="config.expanded = $event"
            [regionNames]="config.regionNames"
            [regionOrcidId]="config.regionOrcidId"
          >
            <img
              header-banner-logo
              src="https://qa.orcid.org/assets/vectors/orcid.logo.icon.svg"
              alt="ORCID logo"
            />
            <button
              mat-icon-button
              type="button"
              matTooltip="Copy ORCID iD"
              aria-label="Copy ORCID iD"
              record-header-name-actions
            >
              <mat-icon>edit</mat-icon>
            </button>
            <span header-banner-expanded-label>Hide details</span>
            <span header-banner-collapsed-label>Show details</span>
            <ng-container header-banner-id-actions>
              <button
                mat-icon-button
                type="button"
                matTooltip="Copy ORCID iD"
                aria-label="Copy ORCID iD"
              >
                <mat-icon>content_copy</mat-icon>
              </button>
              <button
                mat-icon-button
                type="button"
                matTooltip="Print record"
                aria-label="Print record"
              >
                <mat-icon>print</mat-icon>
              </button>
            </ng-container>
          </orcid-header-banner>
        </div>
      </div>

      <div class="example-group">
        <h4>Desktop View - Compact Mode</h4>
        <div class="example-container desktop">
          <orcid-header-banner
            class="orcid-theme"
            [loading]="false"
            [compactMode]="true"
            [isDesktop]="true"
            [title]="config.title"
            [subtitle]="config.showSubtitle ? config.subtitle : ''"
            [primaryIdText]="config.primaryIdText"
            [secondaryIdText]="config.secondaryIdText"
            [expanded]="config.expanded"
            [canToggleExpanded]="config.canToggleExpanded"
            (expandedChange)="config.expanded = $event"
            [regionNames]="config.regionNames"
            [regionOrcidId]="config.regionOrcidId"
          >
            <img
              header-banner-logo
              src="https://qa.orcid.org/assets/vectors/orcid.logo.icon.svg"
              alt="ORCID logo"
            />

            <button
              mat-icon-button
              type="button"
              matTooltip="Copy ORCID iD"
              aria-label="Copy ORCID iD"
              record-header-name-actions
            >
              <mat-icon>edit</mat-icon>
            </button>

            <span header-banner-expanded-label>Hide details</span>
            <span header-banner-collapsed-label>Show details</span>
            <ng-container header-banner-id-actions>
              <button
                mat-icon-button
                type="button"
                matTooltip="Copy ORCID iD"
                aria-label="Copy ORCID iD"
              >
                <mat-icon>content_copy</mat-icon>
              </button>
              <button
                mat-icon-button
                type="button"
                matTooltip="Print record"
                aria-label="Print record"
              >
                <mat-icon>print</mat-icon>
              </button>
            </ng-container>
          </orcid-header-banner>
        </div>
      </div>

      <div class="example-group">
        <h4>Mobile View - Normal Mode</h4>
        <div class="example-container mobile">
          <orcid-header-banner
            class="orcid-theme"
            [loading]="false"
            [compactMode]="false"
            [isDesktop]="false"
            [title]="config.title"
            [subtitle]="config.showSubtitle ? config.subtitle : ''"
            [primaryIdText]="config.primaryIdText"
            [secondaryIdText]="config.secondaryIdText"
            [expanded]="config.expanded"
            [canToggleExpanded]="config.canToggleExpanded"
            (expandedChange)="config.expanded = $event"
            [regionNames]="config.regionNames"
            [regionOrcidId]="config.regionOrcidId"
          >
            <img
              header-banner-logo
              src="https://qa.orcid.org/assets/vectors/orcid.logo.icon.svg"
              alt="ORCID logo"
            />
            <button
              mat-icon-button
              type="button"
              matTooltip="Copy ORCID iD"
              aria-label="Copy ORCID iD"
              record-header-name-actions
            >
              <mat-icon>edit</mat-icon>
            </button>
            <span header-banner-expanded-label>Hide details</span>
            <span header-banner-collapsed-label>Show details</span>
            <ng-container header-banner-id-actions>
              <button
                mat-icon-button
                type="button"
                matTooltip="Copy ORCID iD"
                aria-label="Copy ORCID iD"
              >
                <mat-icon>content_copy</mat-icon>
              </button>
              <button
                mat-icon-button
                type="button"
                matTooltip="Print record"
                aria-label="Print record"
              >
                <mat-icon>print</mat-icon>
              </button>
            </ng-container>
          </orcid-header-banner>
        </div>
      </div>

      <div class="example-group">
        <h4>Mobile View - Compact Mode</h4>
        <div class="example-container mobile">
          <orcid-header-banner
            class="orcid-theme"
            [loading]="false"
            [compactMode]="true"
            [isDesktop]="false"
            [title]="config.title"
            [subtitle]="config.showSubtitle ? config.subtitle : ''"
            [primaryIdText]="config.primaryIdText"
            [secondaryIdText]="config.secondaryIdText"
            [expanded]="config.expanded"
            [canToggleExpanded]="config.canToggleExpanded"
            (expandedChange)="config.expanded = $event"
            [regionNames]="config.regionNames"
            [regionOrcidId]="config.regionOrcidId"
          >
            <img
              header-banner-logo
              src="https://qa.orcid.org/assets/vectors/orcid.logo.icon.svg"
              alt="ORCID logo"
            />

            <button
              mat-icon-button
              type="button"
              matTooltip="Copy ORCID iD"
              aria-label="Copy ORCID iD"
              record-header-name-actions
            >
              <mat-icon>edit</mat-icon>
            </button>
            <span header-banner-expanded-label>Hide details</span>
            <span header-banner-collapsed-label>Show details</span>
            <ng-container header-banner-id-actions>
              <button
                mat-icon-button
                type="button"
                matTooltip="Copy ORCID iD"
                aria-label="Copy ORCID iD"
              >
                <mat-icon>content_copy</mat-icon>
              </button>
              <button
                mat-icon-button
                type="button"
                matTooltip="Print record"
                aria-label="Print record"
              >
                <mat-icon>print</mat-icon>
              </button>
            </ng-container>
          </orcid-header-banner>
        </div>
      </div>

      <div class="example-group">
        <h4>Loading State - Desktop View</h4>
        <div class="example-container desktop">
          <orcid-header-banner
            class="orcid-theme"
            [loading]="true"
            [compactMode]="false"
            [isDesktop]="true"
            [title]="config.title"
            [subtitle]="config.showSubtitle ? config.subtitle : ''"
            [primaryIdText]="config.primaryIdText"
            [secondaryIdText]="config.secondaryIdText"
            [expanded]="config.expanded"
            [canToggleExpanded]="config.canToggleExpanded"
            (expandedChange)="config.expanded = $event"
            [regionNames]="config.regionNames"
            [regionOrcidId]="config.regionOrcidId"
          >
            <img
              header-banner-logo
              src="https://qa.orcid.org/assets/vectors/orcid.logo.icon.svg"
              alt="ORCID logo"
            />
            <button
              mat-icon-button
              type="button"
              matTooltip="Copy ORCID iD"
              aria-label="Copy ORCID iD"
              record-header-name-actions
            >
              <mat-icon>edit</mat-icon>
            </button>
            <span header-banner-expanded-label>Hide details</span>
            <span header-banner-collapsed-label>Show details</span>
            <ng-container header-banner-id-actions>
              <button
                mat-icon-button
                type="button"
                matTooltip="Copy ORCID iD"
                aria-label="Copy ORCID iD"
              >
                <mat-icon>content_copy</mat-icon>
              </button>
              <button
                mat-icon-button
                type="button"
                matTooltip="Print record"
                aria-label="Print record"
              >
                <mat-icon>print</mat-icon>
              </button>
            </ng-container>
          </orcid-header-banner>
        </div>
      </div>

      <div class="example-group">
        <h4>Loading State - Desktop Compact Mode</h4>
        <div class="example-container desktop">
          <orcid-header-banner
            class="orcid-theme"
            [loading]="true"
            [compactMode]="true"
            [isDesktop]="true"
            [title]="config.title"
            [subtitle]="config.showSubtitle ? config.subtitle : ''"
            [primaryIdText]="config.primaryIdText"
            [secondaryIdText]="config.secondaryIdText"
            [expanded]="config.expanded"
            [canToggleExpanded]="config.canToggleExpanded"
            (expandedChange)="config.expanded = $event"
            [regionNames]="config.regionNames"
            [regionOrcidId]="config.regionOrcidId"
          >
            <img
              header-banner-logo
              src="https://qa.orcid.org/assets/vectors/orcid.logo.icon.svg"
              alt="ORCID logo"
            />
            <button
              mat-icon-button
              type="button"
              matTooltip="Copy ORCID iD"
              aria-label="Copy ORCID iD"
              record-header-name-actions
            >
              <mat-icon>edit</mat-icon>
            </button>
            <span header-banner-expanded-label>Hide details</span>
            <span header-banner-collapsed-label>Show details</span>
            <ng-container header-banner-id-actions>
              <button
                mat-icon-button
                type="button"
                matTooltip="Copy ORCID iD"
                aria-label="Copy ORCID iD"
              >
                <mat-icon>content_copy</mat-icon>
              </button>
              <button
                mat-icon-button
                type="button"
                matTooltip="Print record"
                aria-label="Print record"
              >
                <mat-icon>print</mat-icon>
              </button>
            </ng-container>
          </orcid-header-banner>
        </div>
      </div>

      <div class="example-group">
        <h4>Loading State - Mobile View</h4>
        <div class="example-container mobile">
          <orcid-header-banner
            class="orcid-theme"
            [loading]="true"
            [compactMode]="false"
            [isDesktop]="false"
            [title]="config.title"
            [subtitle]="config.showSubtitle ? config.subtitle : ''"
            [primaryIdText]="config.primaryIdText"
            [secondaryIdText]="config.secondaryIdText"
            [expanded]="config.expanded"
            [canToggleExpanded]="config.canToggleExpanded"
            (expandedChange)="config.expanded = $event"
            [regionNames]="config.regionNames"
            [regionOrcidId]="config.regionOrcidId"
          >
            <img
              header-banner-logo
              src="https://qa.orcid.org/assets/vectors/orcid.logo.icon.svg"
              alt="ORCID logo"
            />
            <button
              mat-icon-button
              type="button"
              matTooltip="Copy ORCID iD"
              aria-label="Copy ORCID iD"
              record-header-name-actions
            >
              <mat-icon>edit</mat-icon>
            </button>
            <span header-banner-expanded-label>Hide details</span>
            <span header-banner-collapsed-label>Show details</span>
            <ng-container header-banner-id-actions>
              <button
                mat-icon-button
                type="button"
                matTooltip="Copy ORCID iD"
                aria-label="Copy ORCID iD"
              >
                <mat-icon>content_copy</mat-icon>
              </button>
              <button
                mat-icon-button
                type="button"
                matTooltip="Print record"
                aria-label="Print record"
              >
                <mat-icon>print</mat-icon>
              </button>
            </ng-container>
          </orcid-header-banner>
        </div>
      </div>

      <div class="example-group">
        <h4>Loading State - Mobile Compact Mode</h4>
        <div class="example-container mobile">
          <orcid-header-banner
            class="orcid-theme"
            [loading]="true"
            [compactMode]="true"
            [isDesktop]="false"
            [title]="config.title"
            [subtitle]="config.showSubtitle ? config.subtitle : ''"
            [primaryIdText]="config.primaryIdText"
            [secondaryIdText]="config.secondaryIdText"
            [expanded]="config.expanded"
            [canToggleExpanded]="config.canToggleExpanded"
            (expandedChange)="config.expanded = $event"
            [regionNames]="config.regionNames"
            [regionOrcidId]="config.regionOrcidId"
          >
            <img
              header-banner-logo
              src="https://qa.orcid.org/assets/vectors/orcid.logo.icon.svg"
              alt="ORCID logo"
            />
            <button
              mat-icon-button
              type="button"
              matTooltip="Copy ORCID iD"
              aria-label="Copy ORCID iD"
              record-header-name-actions
            >
              <mat-icon>edit</mat-icon>
            </button>
            <span header-banner-expanded-label>Hide details</span>
            <span header-banner-collapsed-label>Show details</span>
            <ng-container header-banner-id-actions>
              <button
                mat-icon-button
                type="button"
                matTooltip="Copy ORCID iD"
                aria-label="Copy ORCID iD"
              >
                <mat-icon>content_copy</mat-icon>
              </button>
              <button
                mat-icon-button
                type="button"
                matTooltip="Print record"
                aria-label="Print record"
              >
                <mat-icon>print</mat-icon>
              </button>
            </ng-container>
          </orcid-header-banner>
        </div>
      </div>
    </section>

    <section class="docs-section">
      <h3>Inputs</h3>
      <ul>
        <li><code>title</code>, <code>subtitle</code></li>
        <li><code>primaryIdText</code>, <code>secondaryIdText</code></li>
        <li>
          <code>compactMode</code>, <code>isDesktop</code>,
          <code>expanded</code>, <code>canToggleExpanded</code>
        </li>
        <li>
          <code>loading</code>: shows a progress bar and hides content while
          loading
        </li>
        <li><code>regionNames</code>, <code>regionOrcidId</code></li>
      </ul>

      <h3>Outputs</h3>
      <ul>
        <li>
          <code>expandedChange</code>: emitted when the expansion toggle is
          clicked.
        </li>
      </ul>
    </section>
  `,
})
export class RecordHeaderPageComponent {
  config = {
    title: 'Dr. Jane Doe',
    subtitle: 'Jane D.; J. Doe',
    primaryIdText: '0000-0001-2345-6789',
    secondaryIdText: 'https://orcid.org/0000-0001-2345-6789',
    showSubtitle: true,
    canToggleExpanded: true,
    expanded: false,
    loading: false,
    regionNames: 'Names',
    regionOrcidId: 'Orcid iD',
  }
}
