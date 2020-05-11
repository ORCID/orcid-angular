import { storiesOf } from '@storybook/angular'
import { action } from '@storybook/addon-actions'
import { RecaptchaModule } from 'src/app/cdk/recaptcha/recaptcha.module'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { WindowModule } from 'src/app/cdk/window'

let matChips = `
## Select/Unselect
Sample content
`

storiesOf('Components|Captcha', module).add(
  'Plain',
  () => ({
    template: `<div
      appRecaptcha
      (captchaFail)="actions($event)"
      (captchaLoaded)="actions($event)"
    ></div>`,
    props: {
      actions: action('log'),
    },
    moduleMetadata: {
      imports: [ReactiveFormsModule, RecaptchaModule, WindowModule],
      providers: [],
    },
  }),
  {
    notes: {
      markdown: matChips,
    },
  }
)
