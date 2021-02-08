/// <reference types="cypress" />
import { environment } from '../cypress.env'
const randomUser = require('../helpers/randomUser')
const runInfo = require('../helpers/runInfo')

describe('My Orcid sidebar' + runInfo(), () => {
  let userToRegister = randomUser()
  before(() => {
    cy.visit(`${environment.baseUrl}/register`)
    cy.registerUser(userToRegister)
    cy.request(`${environment.baseUrl}/userInfo.json`).then((response) => {
      userToRegister.id = response.body.EFFECTIVE_USER_ORCID
      cy.log(userToRegister)
    })
    // cy.programmaticSignin('testUser')
    // userToRegister = environment['testUser']
  })
  before(() => {
    cy.visit(`${environment.baseUrl}/qa/my-orcid`)
  })
  describe('Orcid id', () => {
    it('display the users Orcid', () => {
      cy.get('app-side-bar-id ').within(() => {
        cy.contains(userToRegister.id)
        cy.contains(`https://orcid.org/${userToRegister.id}`)
      })
    })
    it('display url to navigate to the public page view', () => {})
  })
  describe('Emails' + runInfo(), () => {
    it('display a user with only a primary email "unverified"', () => {})
    it('display a user with only a primary email "verified"', () => {})
    it('display multiple emails "unverified" and "verified"', () => {
      // Expect changes to be display outside and inside of the modal
    })
    describe('Emails edit modals' + runInfo(), () => {
      it('add additional emails and display those as "unverified" with default privacy', () => {
        // Expect changes to be display outside and inside of the modal
      })
      it('remove emails', () => {
        // Expect the primary email to not display the delete button
        // Expect changes to be display outside and inside of the modal
      })
      it('edit a non-primary and display it as "unverified"', () => {
        // Expect changes to be display outside and inside of the modal
      })
      it('edit a primary email and display it as "verified"', () => {
        // Expect changes to be display outside and inside of the modal
      })
      it('display multiple emails "unverified" and "verified"', () => {
        // Expect changes to be display outside and inside of the modal
      })
      it('resend the email verification email', () => {})
      it('set a "verified" email as primary', () => {
        // checks that a secondary email does not have the `make primary` button if not verified
        // Expect changes to be display outside and inside of the modal
      })
      it('change the email privacy', () => {})
      it('make changes and cancel', () => {
        // Expect changes NOT to be display outside and inside of the modal
      })
      it('clicks outside and DONT close the modal ', () => {})
      it('open the terms of use on a separate window ', () => {})
    })
  })
  describe('Websites and socials links', () => {
    it('display a user with no items', () => {})
    it('add items and display those with default privacy', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('remove/delete', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('Drag and drop to rearrange', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('change privacy', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('make changes and cancel', () => {
      // Expect changes NOT to be display outside and inside of the modal
    })
    it('clicks outside and DONT close the modal ', () => {})
  })
  describe('Countries', () => {
    it('display a user with no items', () => {})
    it('add items and display those with default privacy', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('remove/delete', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('Drag and drop to rearrange', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('change privacy', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('make changes and cancel', () => {
      // Expect changes NOT to be display outside and inside of the modal
    })
    it('clicks outside and DONT close the modal ', () => {})
  })
  describe('Other IDs', () => {
    it('display a user with no items', () => {
      // should be hidden from the side bar https://trello.com/c/JZJ75TWl/35-how-to-add-other-ids-is-confusing
    })
    it('display a user with items and default privacy', () => {})
    it('remove/delete', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('Drag and drop to rearrange', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('change privacy', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('make changes and cancel', () => {
      // Expect changes NOT to be display outside and inside of the modal
    })
    it('clicks outside and DONT close the modal ', () => {})
  })
  describe('Keywords', () => {
    it('display a user with no items', () => {})
    it('add items and display those with default privacy', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('remove/delete', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('Drag and drop to rearrange', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('change privacy', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('make changes and cancel', () => {
      // Expect changes NOT to be display outside and inside of the modal
    })
    it('clicks outside and DONT close the modal ', () => {})
  })
})
