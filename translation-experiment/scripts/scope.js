/**
 * Shared scope definition for the translation experiment.
 *
 * Each feature = the FULL set of i18n keys visible on that feature's page,
 * gathered from the component templates that render it (matching what the
 * Cypress screenshots actually capture). Extracted via:
 *   grep -oE '@@[^"]+"' <template>.html
 *
 * To add/adjust a feature: list its keys here (or re-grep its templates) and
 * re-run extract-translations.js then blank-translations.js.
 */

// register page, Step 1 — from step-a.component.html + form-personal.component.html
const REGISTER = [
  // step-a.component.html (page heading, terms-of-use sentence, step nav)
  'register.create',
  'register.reactivateYourOrcidAccount',
  'register.step1.3',
  'register.orcids',
  'register.terms',
  'register.only',
  'register.sign',
  'register.nextStep',
  'register.cancelRegistration',
  'register.cancelReactivation',
  // form-personal.component.html (names + emails form)
  'register.yourNames',
  'register.givenNames',
  'register.familyName',
  'register.optional',
  'register.firstNameError',
  'register.invalidName',
  'topBar.keywordMaxLength',
  'register.yourEmailAddresses',
  'register.primaryEmail',
  'register.primaryEmailRequired2',
  'register.invalidEmail2',
  'register.confirmEmail',
  'register.confirmEmailRequired2',
  'register.confirmationEmailNotMatch2',
  'register.theEmailAddress',
  'register.isAssociatedWith',
  'register.anExisting',
  'register.anUnclaimed',
  'register.aDeactivated',
  'register.orcidRecord',
  'register.youCannotUseThisEmail',
  'register.signInToOrcidUsingThisEmail',
  'register.resendClaimAddress',
  'register.reactivateOrcidAssociated',
  'register.thisLooksLikeAPersonalEmail',
  'register.addA',
  'register.professionalEmail',
  'register.asBackupSoWeCanBetter',
  'register.addAnotherEmailToSecure',
  'register.addingAnAddiotionalEmailAsBackup',
  'regiser.thisLooksLikeAProffessional', // NOTE: real key has a typo ("regiser")
  'register.weRecommendAdding',
  'register.personalEmail',
  'register.asBackupSoYouAlways',
]

// two-factor page — from two-factor-enable.component.html
const TWO_FACTOR = [
  'account.enableTwoFactorAuth',
  'account.step1AuthenticationApp',
  'account.nextStepRecoveryCodes',
  'account.scanQrCodeWithAuthApp',
  'account.qrCodeAltText',
  'account.cantScanQrCodePrefix',
  'account.getSetupCodeInstead',
  'account.copySetupCode',
  'account.enterVerificationCodeFromAuthApp',
  'ngOrcid.signin.2fa.verificationCodeRequired',
  'ngOrcid.signin.2fa.badVerificationCodeLength',
  'ngOrcid.signin.2fa.badVerificationCode',
]

// developer-tools page, intro/terms view — from terms-of-use.component.html
// plus the always-visible header from developer-tools.component.html
const DEVELOPER_TOOLS = [
  // developer-tools.component.html header (always visible)
  'developerTools.developerTools',
  'developerTools.backToMyRecod',
  // terms-of-use.component.html (the intro screen the screenshot captures)
  'developerTools.thisSectionIsIntended',
  'developerTools.gettingStarted',
  'developerTools.orcidOffersAnApi',
  'developerTools.orcidOffersAnApi2',
  'developerTools.allowUserToSignInto',
  'developerTools.getAUserAuthenticated',
  'developerTools.retrieveMachineReadable',
  'developerTools.performMachineSearch',
  'developerTools.obtainHigher',
  'developerTools.orcidApiResful',
  'developerTools.oauth20',
  'developerTools.wellEstablishedStandard',
  'developerTools.publicClientApplicationsAreGranted',
  'developerTools.publicClientApplicationsAreGranted2',
  'developerTools.theOrcidPublicApiAllowsYouToRequestPermission',
  'developerTools.mayBeMoreAppropriate',
  'developerTools.memberApi',
  'developerTools.additionalResources',
  'developerTools.readThePublicApisDocumentation',
  'developerTools.fillOutMoreAobutTheDifferences',
  'developerTools.orcidPublicClientTermsOfService',
  'developerTools.byRegisteringForPublicApi',
  'developerTools.publicClientTermsOfService',
  'developerTools.haveReadAndAgreeToTheOrcidPublicClientTermsOfService',
  'developerTools.registerForYourOrcidPublicApiCredentials',
  'developerTools.youMustAcceptThePublicClientTermsOfService',
  'developerTools.youMustHaveAtLeastOneVerifiedEmail',
  'developerTools.emailsAndDomainsSection',
  'developerTools.noVerifiedEmailAddresses',
]

const FEATURES = {
  'two-factor': TWO_FACTOR,
  'developer-tools': DEVELOPER_TOOLS,
  register: REGISTER,
}

// Union of all experiment keys (used by the blanking step)
const ALL_KEYS = new Set(Object.values(FEATURES).flat())

module.exports = { FEATURES, ALL_KEYS }
