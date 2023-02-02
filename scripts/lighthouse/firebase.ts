import * as firebase from 'firebase'
import { environment } from './environment'
import { Result, ResultFile, MetadataFile } from './types'
const fse = require('fs-extra')

export class FirebaseManager {
  firebaseDB

  constructor() {}

  async initializeFirebase() {
    this.firebaseDB = await firebase.initializeApp(environment.firebaseConfig)
    this.firebaseDB = await firebase.firestore()
    return this.firebaseDB
  }

  async saveOnFirebase(result, id) {
    await this.firebaseDB
      .collection(environment.testPrefix || 'no-prefix')
      .doc(id)
      .set(result)
      .then(function (docRef) {
        console.debug('Document written with ID: ', JSON.stringify(docRef))
      })
      .catch(function (error) {
        console.error('Error adding document: ', error)
      })
  }

  saveFile(file: string, id: string): string {
    const fileName = `${id}.json`
    fse.outputFileSync(`${id}.json`, file)
    return fileName
  }

  generateRecordId(result: Result, date: Date): string {
    const user = // A third user
      result.auditDefinition.loggedAs ||
      // Admin user
      (result.auditDefinition.auth && environment.ORCID_ADMIN_USER) ||
      // Without auth
      'no-auth'

    const id = `${result.auditDefinition.url || 'root'}.${user}.${date
      .toISOString()
      .replace(/:/g, '.')}`

    return id
  }

  generateFilePath(date: Date): string {
    const environmentContext = environment.testPrefix || 'no-prefix'
    return `audits/${environmentContext}/${date
      .toISOString()
      .replace(/:/g, '.')}/`
  }

  async saveFileResults(results: Result[], date: Date) {
    const metadata: MetadataFile = {
      resultFiles: [],
      date: date.toISOString(),
      executedBy: environment.ORCID_ADMIN_USER,
      environmentPrefix: environment.prefix,
    }
    for (const result of results) {
      const filePath = this.saveFileResult(result, date)
      const resultFile: ResultFile = {
        auditDefinition: result.auditDefinition,
        filePath,
      }
      metadata.resultFiles.push(resultFile)
    }
    return this.saveFileMetadata(metadata, date)
  }

  private saveFileMetadata(metadata: MetadataFile, date: Date) {
    const path = this.generateFilePath(date)
    const fileName = `metaData-${date.toISOString().replace(':', '.')}`
    return this.saveFile(JSON.stringify(metadata), path + fileName)
  }

  private saveFileResult(result: Result, date: Date) {
    const fileName = this.generateRecordId(result, date)
    const path = this.generateFilePath(date)
    const filePath = this.saveFile(result.result, path + fileName)
    return filePath
  }
}
