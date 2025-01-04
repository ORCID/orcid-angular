import { writeFileSync } from 'fs'
import * as environmentProduction from '../src/environments/environment.production'
import * as environmentQa from '../src/environments/environment.qa'
import * as environmentSandbox from '../src/environments/environment.sandbox'
import * as environment4200 from '../src/environments/environment.local-with-proxy'
import * as environmentDev from '../src/environments/environment.local'

export function save(data, options) {
  writeFileSync(options.file, data, 'utf8')
}

export function getOptionsObjet(file) {
  const environment = getEnvironmentVar()
  const languageCode = getLanguageCode(file)
  const folder = getFolderName(file)

  return {
    languageCode,
    environment,
    file,
    folder,
  }
}

export function getEnvironmentVar() {
  const environmentIndex = process.argv.lastIndexOf('--env')
  let environment = ''

  if (environmentIndex > -1) {
    environment = process.argv[environmentIndex + 1]
  }

  return environment
}
function getLanguageCode(file) {
  return file.split('/')[2]
}

function getFolderName(file) {
  const folderPathSegments = file.split('/')
  folderPathSegments.pop()
  return folderPathSegments.join('/')
}

export function runtimeEnvironmentScript() {
  return `
    (function() {
      // The raw environment objects
      var environmentProduction = ${JSON.stringify(environmentProduction.environment)};
      var environmentQa = ${JSON.stringify(environmentQa.environment)};
      var environmentSandbox = ${JSON.stringify(environmentSandbox.environment)};
      var environment4200 = ${JSON.stringify(environment4200.environment)};
      var environmentDev = ${JSON.stringify(environmentDev.environment)};

      function getCurrentLeanDomain() {
        var port = window.location.port ? ':' + window.location.port : '';
        // e.g. "qa.myorg.com" -> ["qa", "myorg", "com"]
        // .slice(-2) -> ["myorg", "com"]
        return window.location.hostname.split('.').slice(-2).join('.') + port;
      }

      function getSubDomain() {
        // e.g. "qa.myorg.com" -> ["qa", "myorg", "com"]
        // .slice(0, -2) -> ["qa"]
        var subdomain = window.location.hostname.split('.').slice(0, -2).join('.');
        return subdomain ? subdomain + '.' : '';
      }

      function replaceEnvironmentVars(env) {
        if (!env) return;
        if (env.API_WEB) {
          env.API_WEB = env.API_WEB
            .replace('<SUBDOMAIN>', getSubDomain())
            .replace('<DOMAIN>', getCurrentLeanDomain());
        }
        if (env.BASE_URL) {
          env.BASE_URL = env.BASE_URL
            .replace('<SUBDOMAIN>', getSubDomain())
            .replace('<DOMAIN>', getCurrentLeanDomain());
        }
        if (env.API_PUB) {
          env.API_PUB = env.API_PUB
            .replace('<SUBDOMAIN>', getSubDomain())
            .replace('<DOMAIN>', getCurrentLeanDomain());
        }
      }

      var domain = window.location.hostname + window.location.pathname;
      var chosenEnv = environmentProduction; // default to production

      if (domain.includes('qa.orcid.org')) {
        chosenEnv = environmentQa;
      } else if (domain.includes('sandbox.orcid.org')) {
        chosenEnv = environmentSandbox;
      } else if (domain.includes('localhost:4200')) {
        chosenEnv = environment4200;
      } else if (domain.includes('dev.orcid.org')) {
        chosenEnv = environmentDev;
      }

      replaceEnvironmentVars(chosenEnv);

      window.runtimeEnvironment = chosenEnv;
    })();
  `;
}