import { FirebaseManager } from './firebase'
import { Puppeteer } from './puppeteer'
import { environment } from './environment'
import * as readlineSync from 'readline-sync'

class AuditManager {
  firebase: FirebaseManager
  puppeteer: Puppeteer

  constructor() {
    this.puppeteer = new Puppeteer()
    this.firebase = new FirebaseManager()
  }

  async initFirebase() {
    await this.firebase.initializeFirebase()
  }

  async runAudit() {
    const audits = []
    for (let audit of environment.ORCID_URLS_TO_AUDIT) {
      await this.puppeteer.launch()
      try {
        if (audit.auth) {
          await this.puppeteer.login()
        }
        if (audit.loggedAs) {
          await this.puppeteer.loginAs(audit.loggedAs)
        }
        const result = await this.puppeteer.runAudit(audit.url)

        audits.push({ audit, result: JSON.stringify(result) })
      } catch (e) {
        console.log('Error while executing audit ' + JSON.stringify(audit))
        console.log(JSON.stringify(e))
        throw e
      } finally {
        await this.puppeteer.kill()
      }
    }

    return audits
  }
}

;(async () => {
  const audit = new AuditManager()
  audit.initFirebase()
  const result = await audit.runAudit()

  const saveTheResult =
    (readlineSync.keyInYN('Do you want to save the results?') ||
      readlineSync.keyInYN(
        'IF NOT THE COLLECTED RESULTS WILL BE LOST! Do you want to save the results?'
      )) &&
    readlineSync.keyInYN('PLEASE CONFIRM you want to save the results?')
  if (saveTheResult) {
    await audit.firebase.saveResultsArray(result)
  }
})()
