import { configure, addParameters, addDecorator } from '@storybook/angular'
import { withA11y } from '@storybook/addon-a11y'

import '!style-loader!css-loader!sass-loader!./storybook.orcid-theme.scss'

addDecorator(withA11y)
//
addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
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
