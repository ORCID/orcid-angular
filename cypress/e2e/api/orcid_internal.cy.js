
/// <reference types="cypress" />
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('Scope /orcid-internal', async function () {
//test requires VPN connection

    const curlStatement =
      "curl -i -L -k -H 'Accept: application/json' --data 'client_id=APP-VZK0IUK07U32NDTK&client_secret=d3be4dbd-7cc4-4b83-94f4-6bb6da442ccf&grant_type=client_credentials&redirect_uri=https://qa.orcid.org/&scope=/premium-notification /orcid-internal' http://reg-qa-appall-dfw-x1.int.orcid.org:13103/orcid-internal-api/oauth/token"
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
    )//qase

})