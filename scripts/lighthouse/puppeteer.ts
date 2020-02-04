import { environment } from './environment'
import * as puppeteer from 'puppeteer'
import { Page, Browser } from 'puppeteer'
import * as lighthouse from 'lighthouse'

const log = require('lighthouse-logger')

const LOGIN_URL = 'signin'

export class Puppeteer {
  PORT = 8041
  browser: Browser
  page: Page
  opts = {
    port: this.PORT,
    enableErrorReporting: true,
    logLevel: 'info',
    chromeFlags: ['--show-paint-rects'],
  }
  constructor() {}

  async launch() {
    this.browser = await puppeteer.launch({
      args: [`--remote-debugging-port=${this.PORT}`],
      headless: false,
      // slowMo: 50,
      executablePath:
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    })
  }

  async login() {
    this.page = await this.browser.newPage()
    await this.page.goto(
      `${environment.protocol}${environment.prefix}${
        environment.baseURL
      }/${LOGIN_URL}`
    )
    const emailInput = await this.page.$('input[id="userId"]')
    await emailInput.type(environment.ORCID_ADMIN_USER)
    const passwordInput = await this.page.$('input[type="password"]')
    await passwordInput.type(environment.ORCID_ADMIN_PASSWORD)

    await Promise.all([
      await this.page.$eval('#form-sign-in-button', form => {
        return (form as HTMLElement).click()
      }),
      this.page.waitForNavigation(),
    ])
    this.page.close()
  }

  async loginAs(orcidId) {
    this.page = await this.browser.newPage()
    await this.page.goto(
      `${environment.protocol}${environment.prefix}${
        environment.baseURL
      }/switch-user?username=${orcidId}`
    )
    this.page.close()
  }

  async runAudit(url) {
    await log.setLevel(this.opts.logLevel)
    const result = await lighthouse(
      `${environment.protocol}${environment.prefix}${
        environment.baseURL
      }/${url}`,
      this.opts
    )
    return result.lhr
  }

  kill() {
    this.browser.close()
  }
}
