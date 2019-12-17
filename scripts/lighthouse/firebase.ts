import * as firebase from 'firebase'
import { environment } from './environment'
const fse = require('fs-extra')

export class FirebaseManager {
  firebaseDB

  constructor() {}

  async initializeFirebase() {
    this.firebaseDB = await firebase.initializeApp(environment.firebaseConfig)
    this.firebaseDB = await firebase.firestore()
    return this.firebaseDB
  }

  async saveResultsArray(results) {
    for (const result of results) {
      const id = this.generateRecordId(result)
      await this.saveOnFirebase(result, id)
      await this.saveFile(result, id)
    }
  }

  async saveOnFirebase(result, id) {
    await this.firebaseDB
      .collection(environment.testPrefix || 'no-prefix')
      .doc(id)
      .set(result)
      .then(function(docRef) {
        console.log('Document written with ID: ', JSON.stringify(docRef))
      })
      .catch(function(error) {
        console.error('Error adding document: ', error)
      })
  }

  async saveFile(result, id) {
    await fse.outputFile(
      `audits/${environment.testPrefix || 'no-prefix'}/${id}.json`,
      result.result,
      err => {
        if (err) {
          console.log(`error saving file first load ${id}`)
        } else {
          console.log(`saved file first load ${id}`)
        }
      }
    )
  }

  generateRecordId(result) {
    const date = new Date().toISOString()
    const user = // A third user
      result.audit.loggedAs ||
      // Admin user
      (result.audit.auth && environment.ORCID_ADMIN_USER) ||
      // Without auth
      'no-auth'

    const id = `${environment.testPrefix || 'no-prefix'}.${result.audit.url ||
      'root'}.${user}.${date}.json`

    return id
  }
}
