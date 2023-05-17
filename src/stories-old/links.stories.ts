import { storiesOf } from '@storybook/angular'

let matChips = `
## Select/Unselect
Sample content
`

storiesOf('Components/Urls', module).add(
  'Plain',
  () => ({
    styles: [
      `
    button: {
      margin: 10px;
    }
    `,
    ],
    template: `
        <a href="#">Link</a>
    `,

    moduleMetadata: {
      imports: [],
    },
  }),
  {
    notes: {
      markdown: matChips,
    },
  }
)
