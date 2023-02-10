/// <reference types="cypress" />
import { qase } from 'cypress-qase-reporter/dist/mocha'
import userData from '../../fixtures/testing-users.fixture.json'

describe('Scope /orcid-internal', async function () {
  //test requires VPN connection

  const curlStatement =
    "curl -i -L -k -H 'Accept: application/json' --data 'client_id=" +
    userData.cyAPI_orcid_internal.clientId +
    '&client_secret=' +
    userData.cyAPI_orcid_internal.secret +
    "&grant_type=client_credentials&redirect_uri=https://qa.orcid.org/&scope=/premium-notification /orcid-internal' http://reg-qa-appall-dfw-x1.int.orcid.org:13103/orcid-internal-api/oauth/token"

  qase(
    '150',
    it('Verify scope /orcid-internal returns an access token', function () {
      cy.exec(curlStatement).then((response) => {
        //verify curl was executed successfully
        expect(response.code).to.eq(0)
        expect(response.stdout).to.contain('HTTP/1.1 200')
        expect(response.stdout).to.contain('access_token')
      })
    })
  ) //qase
})
