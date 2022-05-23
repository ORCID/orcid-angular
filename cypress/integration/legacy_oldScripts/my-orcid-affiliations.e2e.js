/// <reference types="cypress" />
const runInfo = require('../../helpers/runInfo')

describe('Affiliations' + runInfo(), () => {
  describe('Employment' + runInfo(), () => {
    it('show an option to add more items', () => {})
    it('show an option to edit items', () => {})
    it('display a user with no items', () => {
      // TODO ??
    })

    describe('display a user with an item added by the same user', () => {
      it('show the number of works as 1', () => {})
      it('display the item privacy', () => {})
      it('show the item details', () => {})
      it('opens external URLs on a separate tab', () => {})
      it('show the item edit button', () => {})
      it('can be deleted', () => {})
    })

    describe('display a user with an item added with the API', () => {
      it('show the number of items on the title as 1', () => {})
      it('show the item source', () => {})
      it('show the item "make a copy and edit" button', () => {})
      it('can be deleted', () => {})
    })

    describe('display a user with an item added with multiple sources', () => {
      it('show the number of items on the title as 1', () => {})
      it('show the item multiple sources', () => {})
      it('expand and show the multiple sources of the same item', () => {
        // TODO ??
      })
    })

    describe('display a user with many items', () => {
      // TODO ??
      it('show the number of items on the title as N', () => {})
      it('can sort the items by the end date', () => {})
      it('can sort the items by start date', () => {})
      it('can sort the items by start title', () => {})
    })
  })

  // REPEAT ALL THE SAME TESTs for the following
  describe('Distinction' + runInfo(), () => {})
  describe('Qualification' + runInfo(), () => {})
  describe('Membership' + runInfo(), () => {})
  describe('Service' + runInfo(), () => {})
  describe('Education' + runInfo(), () => {})
  describe('Invited Position' + runInfo(), () => {})
})
