import { storiesOf } from '@storybook/angular'
import mockSearchResults from '../../.mockData/mock-search.json'
import { PlatformInfoService } from '../../src/app/cdk/platform-info/platform-info.service'
import { Platform } from '@angular/cdk/platform'
import { MatCardModule } from '@angular/material/card'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatButtonModule } from '@angular/material/button'

storiesOf('Components/Card', module)
  .add('Regular', () => ({
    template: `
      <mat-card class="example-card" style="max-width: 400px">
      <mat-card-header>
        <div mat-card-avatar style="background-image: url(https://material.angular.io/assets/img/examples/shiba1.jpg);
        background-size: cover">
        </div>
        <mat-card-title>Shiba Inu</mat-card-title>
        <mat-card-subtitle>Dog Breed</mat-card-subtitle>
      </mat-card-header>
      <img mat-card-image src="https://material.angular.io/assets/img/examples/shiba2.jpg" alt="Photo of a Shiba Inu">
      <mat-card-content>
        <p>
          The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.
          A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally
          bred for hunting.
        </p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button>LIKE</button>
        <button mat-button>SHARE</button>
      </mat-card-actions>
    </mat-card>
`,
    moduleMetadata: {
      imports: [MatCardModule, MatProgressBarModule, MatButtonModule],
      service: [PlatformInfoService, Platform],
    },
    props: {
      searchResults: mockSearchResults,
    },
  }))
  .add('Wizard', () => ({
    template: `
      <div class="columns-8">
        <mat-card class="orcid-wizard" style="max-width: 800px">
        <mat-card-header>
          <mat-card-title>Card wizard title</mat-card-title>
          <mat-card-subtitle>Card wizard subtitle</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>
            The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.
            A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally
            bred for hunting.
          </p>
        </mat-card-content>
      </mat-card>
      <div>
`,
    moduleMetadata: {
      imports: [MatCardModule, MatProgressBarModule],
    },
    props: {
      searchResults: mockSearchResults,
    },
  }))
  .add('Wizard loading', () => ({
    template: `
      <div class="columns-8">
        <mat-card class="orcid-wizard" style="max-width: 800px">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        <mat-card-header>
          <mat-card-title>Card wizard title</mat-card-title>
          <mat-card-subtitle>Card wizard subtitle</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>
            The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.
            A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally
            bred for hunting.
          </p>
        </mat-card-content>
      </mat-card>
      <div>
`,
    moduleMetadata: {
      imports: [MatCardModule, MatProgressBarModule],
    },
    props: {
      searchResults: mockSearchResults,
    },
  }))
