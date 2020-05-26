import { storiesOf } from '@storybook/angular'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatMenuModule } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button'
import { MatStepperModule } from '@angular/material/stepper'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

const matStepper = `
For full documentation on how to implement this with an Angular
form see [the official material docs](https://material.angular.io/components/stepper/overview)
`

storiesOf('Components|Stepper', module)
  .add(
    'horizontal',
    () => ({
      template: `
  <mat-horizontal-stepper [linear]="isLinear" #stepper>
    <mat-step [stepControl]="firstFormGroup">
      <form>
        <ng-template matStepLabel>Fill out your name</ng-template>
        <mat-form-field>
          <mat-label>Name</mat-label>
          <input matInput placeholder="Last name, First name">
        </mat-form-field>
        <div>
          <button mat-button color="primary" matStepperNext>Next</button>
        </div>
      </form>
    </mat-step>
    <mat-step [stepControl]="secondFormGroup">
      <form>
        <ng-template matStepLabel>Fill out your address</ng-template>
        <mat-form-field>
          <mat-label>Address</mat-label>
          <input matInput placeholder="Ex. 1 Main St, New York, NY">
        </mat-form-field>
        <div>
          <button mat-button color="primary" matStepperPrevious>Back</button>
          <button mat-button color="primary" matStepperNext>Next</button>
        </div>
      </form>
    </mat-step>
    <mat-step>
      <ng-template matStepLabel>Done</ng-template>
      <p>You are now done.</p>
      <div>
        <button mat-button color="primary"matStepperPrevious>Back</button>
        <button mat-button color="primary" (click)="stepper.reset()">Reset</button>
      </div>
    </mat-step>
  </mat-horizontal-stepper>
  `,
      moduleMetadata: {
        imports: [
          MatStepperModule,
          MatButtonModule,
          BrowserAnimationsModule,
          MatInputModule,
        ],
      },
    }),
    {
      notes: {
        markdown: matStepper,
      },
    }
  )
  .add(
    'vertical',
    () => ({
      template: `
  <mat-vertical-stepper [linear]="isLinear" #stepper>
    <mat-step [stepControl]="firstFormGroup">
      <form>
        <ng-template matStepLabel>Fill out your name</ng-template>
        <mat-form-field>
          <mat-label>Name</mat-label>
          <input matInput placeholder="Last name, First name">
        </mat-form-field>
        <div>
          <button mat-button color="primary" matStepperNext>Next</button>
        </div>
      </form>
    </mat-step>
    <mat-step [stepControl]="secondFormGroup">
      <form>
        <ng-template matStepLabel>Fill out your address</ng-template>
        <mat-form-field>
          <mat-label>Address</mat-label>
          <input matInput placeholder="Ex. 1 Main St, New York, NY">
        </mat-form-field>
        <div>
          <button mat-button color="primary" matStepperPrevious>Back</button>
          <button mat-button color="primary" matStepperNext>Next</button>
        </div>
      </form>
    </mat-step>
    <mat-step>
      <ng-template matStepLabel>Done</ng-template>
      <p>You are now done.</p>
      <div>
        <button mat-button color="primary"matStepperPrevious>Back</button>
        <button mat-button color="primary" (click)="stepper.reset()">Reset</button>
      </div>
    </mat-step>
  </mat-vertical-stepper>
  `,
      moduleMetadata: {
        imports: [
          MatStepperModule,
          MatButtonModule,
          BrowserAnimationsModule,
          MatInputModule,
        ],
      },
    }),
    {
      notes: {
        markdown: matStepper,
      },
    }
  )
