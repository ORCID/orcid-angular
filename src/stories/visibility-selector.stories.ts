import { moduleMetadata } from '@storybook/angular'
import type { Meta, StoryObj } from '@storybook/angular'
import { CommonModule } from '@angular/common'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { VisibilitySelectorModule } from 'src/app/cdk/visibility-selector/visibility-selector.module'
import {
  FormBuilder,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms'
import { forwardRef } from 'react'
import { VisibilitySelectorComponent } from 'src/app/cdk/visibility-selector/visibility-selector/visibility-selector.component'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window/window.service'
import { VISIBILITY_OPTIONS } from 'src/app/constants'

const meta: Meta<VisibilitySelectorComponent> = {
  title: 'VisibilitySelector',
  component: VisibilitySelectorComponent,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/angular/writing-docs/autodocs
  tags: ['autodocs'],
  render: (args) => ({ props: args }),
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        VisibilitySelectorModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [WINDOW_PROVIDERS],
    }),
  ],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/angular/configure/story-layout
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<VisibilitySelectorComponent>

export const PublicVisibilitySelector: Story = {
  args: {
    privacy: 'PUBLIC',
  },
}

export const LimitedVisibilitySelector: Story = {
  args: {
    privacy: 'LIMITED',
  },
}

export const PrivateVisibilitySelector: Story = {
  args: {
    privacy: 'PRIVATE',
  },
}

export const ErrorVisibilitySelector: Story = {
  args: {
    privacy: 'PRIVATE',
    visibilityError: true,
  },
}

export const VisibilitySelectorMultiEdit: Story = {
  args: {
    privacy: 'PUBLIC',
    visibilityError: true,
    multiEdit: 'multi',
  },
}

export const VisibilitySelectorSingleEdit: Story = {
  args: {
    privacy: 'PUBLIC',
    multiEdit: 'single',
  },
}

export const VisibilitySelectorGroupEdit: Story = {
  args: {
    privacy: 'PUBLIC',
    multiEdit: 'selected',
  },
}
