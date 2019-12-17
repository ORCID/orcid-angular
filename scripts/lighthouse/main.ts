import { FirebaseManager } from './firebase'
import { Puppeteer } from './puppeteer'
import { environment } from './environment'
import { Result } from './types'

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

  async runAudit(): Promise<Result[]> {
    const audits: Result[] = []
    for (let audit of environment.ORCID_URLS_TO_AUDIT) {
      await this.puppeteer.launch()
      try {
        if (audit.auth || audit.loggedAs) {
          await this.puppeteer.login()
        }
        if (audit.loggedAs) {
          await this.puppeteer.loginAs(audit.loggedAs)
        }
        const result = await this.puppeteer.runAudit(audit.url)

        audits.push({ auditDefinition: audit, result: JSON.stringify(result) })
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
  const result: Result[] = await audit.runAudit()
  const date = new Date()
  await audit.firebase.saveFileResults(result, date)
})()
