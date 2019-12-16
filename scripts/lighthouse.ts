import lighthouse from 'lighthouse/lighthouse-core'
import { launch } from 'chrome-launcher/chrome-launcher'
import * as firebase from 'firebase'
import * as fs from 'fs'
const log = require('lighthouse-logger')

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
  fs.writeFile(`${'report'}.json`, JSON.stringify(result), err => {
    if (err) {
    }
    console.log(`Lighthouse JSON report saved`)
  })

  const fullDataId = await _firebaseDB
    .collection('audits')
    .add({ JSON: JSON.stringify(result) })
    .then(function(docRef) {
      console.log('Document written with ID: ', docRef.id)
      return docRef
    })
    .catch(function(error) {
      // THROW AND ERROR
      console.error('Error adding document: ', error)
    })

  const summary = {
    fetchTime: result.fetchTime,
    requestedUrl: result.requestedUrl,
    metrics: generateTrackableReport(result),
    fullReportRef: fullDataId,
  }

  console.log(summary)

  const summaryId = await _firebaseDB
    .collection('summary')
    .add(summary)
    .then(function(docRef) {
      console.log('Document written with ID: ', docRef.id)
    })
    .catch(function(error) {
      console.error('Error adding document: ', error)
    })
}

// Pulling out the metrics we are interested in
function generateTrackableReport(audit) {
  const reports = [
    'first-contentful-paint',
    'first-meaningful-paint',
    'speed-index',
    'interactive',
    'first-cpu-idle',
    'estimated-input-latency',
  ]

  const obj = {
    results: {},
  }

  reports.forEach(report => {
    obj.results[report] = getRequiredAuditMetrics(audit.audits[report])
  })
  return obj
}

function getRequiredAuditMetrics(metrics) {
  return {
    id: metrics.id,
    score: metrics.score,
    value: metrics.numericValue,
  }
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
    // slowMo: 50,
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  })

  const page = await browser.newPage()
  await page.goto(`${url}/signin`)

  const emailInput = await page.$('input[id="userId"]')
  await emailInput.type('***@gmail.com')
  const passwordInput = await page.$('input[type="password"]')
  await passwordInput.type('****')
  await Promise.all([
    await page.$eval('#form-sign-in-button', form => form.click()),
    page.waitForNavigation(),
  ])

  opts.port = PORT
  opts.enableErrorReporting = true
  opts.logLevel = 'info'
  log.setLevel(opts.logLevel)
  try {
    const result = await lighthouse(url, opts)
    return result.lhr
  } finally {
    console.log('after kill')
    await browser.close()
  }
}

// Usage:

async function test() {
  const opts = {
    chromeFlags: ['--show-paint-rects'],
  }

  try {
    await initializeFirebase()

    let result = await launchChromeAndRunLighthouse(
      'https://orcid.org/my-orcid',
      opts
    )
    await addRecord(result)
  } finally {
    // Cleanup
  }
}

test()
