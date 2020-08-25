import { configure, addParameters, addDecorator } from '@storybook/angular'
import { withA11y } from '@storybook/addon-a11y'

import '@angular/localize/init'

import '!style-loader!css-loader!sass-loader!./storybook.orcid-theme.scss'

addDecorator(withA11y)
//
addParameters({
  options: {
    hierarchyRootSeparator: /\|/,

    storySort: (a, b) => {
      if (
        a[1].parameters &&
        a[1].parameters.order &&
        b[1].parameters &&
        b[1].parameters.order
      ) {
        if (a[1].parameters.order === b[1].parameters.order) {
          return 0
        }
        if (a[1].parameters.order > b[1].parameters.order) {
          return 1
        } else {
          return -1
        }
      } else if (
        a[1].parameters &&
        !a[1].parameters.order &&
        b[1].parameters &&
        !b[1].parameters.order
      ) {
        return 0
      } else {
        return a[1].parameters && !a[1].parameters.order ? 1 : -1
      }
    },
  },
  docs: {
    iframeHeight: '60px',
  },
})
// automatically import all files ending in *.stories.ts
configure(
  require.context('../src/stories', true, /\.stories\.(ts|mdx)$/),
  module
)
