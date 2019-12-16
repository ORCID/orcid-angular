import lighthouse from 'lighthouse/lighthouse-core'
import { launch } from 'chrome-launcher/chrome-launcher'
import * as firebase from 'firebase'
const puppeteer = require('puppeteer')

let _firebase
let _firebaseDB
async function initializeFirebase() {
  const firebaseConfig = {
    apiKey: 'AIzaSyB0JjN2eyKXo0LueC3sxNR3EdID-cgfHpA',
    authDomain: 'performance-audits.firebaseapp.com',
    databaseURL: 'https://performance-audits.firebaseio.com',
    projectId: 'performance-audits',
    storageBucket: 'performance-audits.appspot.com',
    messagingSenderId: '477782972360',
    appId: '1:477782972360:web:2d5f9c6b239943f7cdd2fd',
    measurementId: 'G-0EL4T6LP5F',
  }
  _firebase = await firebase.initializeApp(firebaseConfig)
  _firebaseDB = await firebase.firestore()
}

async function addRecord(result) {
  console.log(result)
  const fullDataId = await _firebaseDB
    .collection('audits')
    .add({ JSON: JSON.stringify(result) })
    .then(function(docRef) {
      console.log('Document written with ID: ', docRef.id)
    })
    .catch(function(error) {
      console.error('Error adding document: ', error)
    })

  const summaryId = await _firebaseDB
    .collection('summary')
    .add({ metrics: result.audits.metrics, full: 'fullDataId' })
    .then(function(docRef) {
      console.log('Document written with ID: ', docRef.id)
    })
    .catch(function(error) {
      console.error('Error adding document: ', error)
    })
}

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
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  })

  const page = await browser.newPage()
  await page.goto(`${url}/signin`)

  const emailInput = await page.$('input[id="userId"]')
  await emailInput.type('****@gmail.com')
  const passwordInput = await page.$('input[type="password"]')
  await passwordInput.type('****')
  await Promise.all([
    await page.$eval('#form-sign-in-button', form => form.click()),
    page.waitForNavigation(),
  ])

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
    await initializeFirebase()

    let result = await launchChromeAndRunLighthouse(
      'https://orcid.org/myorcid',
      opts
    )
    await addRecord(result)

    result = await launchChromeAndRunLighthouse('https://qa.orcid.org', opts)
    await addRecord(result)

    result = await launchChromeAndRunLighthouse(
      'https://sandbox.orcid.org',
      opts
    )
    await addRecord(result)
  } finally {
    // Cleanup
  }
}

test()
