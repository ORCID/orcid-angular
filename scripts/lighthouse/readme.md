## Lighthouse

This project uses [Puppeteer](https://github.com/puppeteer/puppeteer) and [Lighthouse](https://github.com/GoogleChrome/lighthouse), to automatically run performance, accessibility and best practices audits on the production application.

#### How to run

First make sure to have npm and yarn install

Clone and install orcid-angular

```
git clone https://github.com/ORCID/orcid-angular
cd orcid-angular
yarn
```

Define an `environment.ts` file on `scripts/lighthouse`. With the following content:

```
import { Environment } from './types'

export const environment: Environment = {
  protocol: 'https://',
  prefix: '',
  baseURL: 'orcid.org',
  testPrefix: 'sample',
  ORCID_URLS_TO_AUDIT: [
    {
      url: 'orcid.org',
      auth: false,
    }
  ]
}
```

Run the test

```
yarn lighthouse
```

This will save the lighthouse reports on the audits folder at the root of the project, for a graphical display of this report you can use [Lighthouse Report Viewer](https://googlechrome.github.io/lighthouse/viewer/)

#### How to test pages that require authentication

... in development

#### How to generate a report

... in development
