import lighthouse from 'lighthouse/lighthouse-core'
import { launch } from 'chrome-launcher/chrome-launcher'
const puppeteer = require('puppeteer')

async function launchChromeAndRunLighthouse(url, opts, config = null) {
  // const chrome = await launch({ chromeFlags: opts.chromeFlags })
  // opts.port = chrome.port
  // console.log('after launch')
  // try {
  //   const { lhr } = await lighthouse(url, opts, config)

  const PORT = 8041
  const browser = await puppeteer.launch({
    args: [`--remote-debugging-port=${PORT}`],
    headless: false,
    slowMo: 50,
  })

  const page = await browser.newPage()
  await page.goto(`${url}/signin`)

  opts.port = browser.port
  console.log('after launch')
  try {
    const result = await lighthouse(url, { port: PORT })
    console.log('okok')
    return result.lhr
  } finally {
    console.log('after kill')
    await browser.close()
  }
}

const opts = {
  chromeFlags: ['--show-paint-rects'],
}

// Usage:

async function test() {
  try {
    console.log(
      Object.keys(
        await launchChromeAndRunLighthouse('https://orcid.org/myorcid', opts)
      ).length
    )
    console.log(
      Object.keys(
        await launchChromeAndRunLighthouse('https://qa.orcid.org', opts)
      ).length
    )
    console.log(
      Object.keys(
        await launchChromeAndRunLighthouse('https://sandbox.orcid.org', opts)
      ).length
    )
  } finally {
    // Cleanup
  }
}

test()
