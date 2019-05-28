import { ApplicationMenuItemBasic } from 'src/app/types/menu.local'
import { LOCALE } from '../../../locale/messages.dynamic.en'

export const menu: ApplicationMenuItemBasic[] = [
  {
    id: 'public-layout.for_researchers',
    label: LOCALE['public-layout.for_researchers'],
    route: '/',
    buttons: [
      {
        id: 'public-layout.for_researchers',
        label: LOCALE['public-layout.for_researchers'],
      },
      {
        id: 'public-layout.sign_in',
        label: LOCALE['public-layout.sign_in'],
      },
      {
        id: 'login.registerOrcidId',
        label: LOCALE['login.registerOrcidId'],
      },
      {
        id: 'manage_delegators.learn_more.link.text',
        label: LOCALE['manage_delegators.learn_more.link.text'],
      },
    ],
  },
  {
    id: 'organizations',
    label: LOCALE['public-layout.for_organizations'],

    buttons: [
      {
        label: LOCALE['public-layout.for_organizations'],
        id: 'organizations',
      },
      {
        label: LOCALE['public-layout.funders'],
        id: 'funders',

        buttons: [
          {
            label: LOCALE['public-layout.funders'],
            id: 'funders',
          },
          {
            label: LOCALE['manage_delegators.learn_more.link.text'],
            id: 'learn',
          },
          {
            label: LOCALE['ngOrcid.outreach'],
            id: 'outreach',
          },
          {
            label: LOCALE['public-layout.membership'],
            id: 'membership',
          },
        ],
      },
      {
        label: LOCALE['public-layout.research_organizations'],
        id: 'research',

        buttons: [
          {
            id: 'research',
            label: LOCALE['public-layout.research_organizations'],
          },
          {
            id: 'learn',
            label: LOCALE['manage_delegators.learn_more.link.text'],
          },
          {
            id: 'outreach',
            label: LOCALE['ngOrcid.outreach'],
          },
          {
            id: 'membership',
            label: LOCALE['public-layout.membership'],
          },
          {
            id: 'use',
            label: LOCALE['ngOrcid.useCases'],
          },
        ],
      },
      {
        id: 'publishers',
        label: LOCALE['public-layout.publishers'],

        buttons: [
          {
            id: 'publishers',
            label: LOCALE['public-layout.publishers'],
          },
          {
            id: 'learn',
            label: LOCALE['manage_delegators.learn_more.link.text'],
          },
          {
            id: 'outreach',
            label: LOCALE['ngOrcid.outreach'],
          },
          {
            id: 'membership',
            label: LOCALE['public-layout.membership'],
          },
        ],
      },

      {
        id: 'associations',
        label: LOCALE['public-layout.associations'],

        buttons: [
          {
            id: 'associations',
            label: LOCALE['public-layout.associations'],
          },
          {
            id: 'learn',
            label: LOCALE['manage_delegators.learn_more.link.text'],
          },
          {
            id: 'outreach',
            label: LOCALE['ngOrcid.outreach'],
          },
          {
            id: 'membership',
            label: LOCALE['public-layout.membership'],
          },
          {
            id: 'use',
            label: LOCALE['ngOrcid.useCases'],
          },
        ],
      },

      {
        id: 'integrators',

        label: LOCALE['public-layout.integrators'],

        buttons: [
          {
            id: 'integrators',
            label: LOCALE['public-layout.integrators'],
          },
          {
            id: 'api',
            label: LOCALE['ngOrcid.theOrcidApi'],
          },
          {
            id: 'register',
            label: LOCALE['ngOrcid.registerClientApp'],
          },
          {
            id: 'current',
            label: LOCALE['ngOrcid.currentIntegrations'],
          },
          {
            id: 'chart',
            label: LOCALE['ngOrcid.integrationsChart'],
          },
          {
            id: 'beta',
            label: LOCALE['ngOrcid.betaTesters'],
          },
        ],
      },
    ],
  },
  {
    id: 'about',
    label: LOCALE['public-layout.about'],

    buttons: [
      { id: 'about', label: LOCALE['public-layout.about'] },

      {
        id: 'what',
        label: LOCALE['public-layout.what_is_orcid'],

        buttons: [
          {
            id: 'what',
            label: LOCALE['public-layout.what_is_orcid'],
          },
          {
            id: 'mission',
            label: LOCALE['public-layout.our_mission'],
          },
          {
            id: 'principles',
            label: LOCALE['public-layout.our_principles'],
          },
          {
            id: 'governance',
            label: LOCALE['ngOrcid.ourGovernance'],
          },
          {
            id: 'policies',
            label: LOCALE['ngOrcid.ourPolicies'],
          },
        ],
      },
      { id: 'team', label: LOCALE['public-layout.the_orcid_team'] },
      {
        id: 'community',
        label: LOCALE['public-layout.the_orcid_community'],

        buttons: [
          {
            id: 'community',
            label: LOCALE['public-layout.the_orcid_community'],
          },
          { id: 'groups', label: LOCALE['public-layout.working_groups'] },
          {
            id: 'public-layout.sponsors',
            label: LOCALE['public-layout.sponsors'],
          },
          { id: 'members', label: LOCALE['public-layout.members'] },
          // TODO CEHCK WHY  'LAUNCH PARTNERS' IS REPEATED,
          { id: 'LAUNCH', label: LOCALE['public-layout.launch_partners'] },
          { id: 'source', label: LOCALE['ngOrcid.openSource'] },
          { id: 'PARTNERS', label: LOCALE['ngOrcid.partners'] },
          { id: 'ADOPTION', label: LOCALE['ngOrcid.adoptionAndInt'] },
          { id: 'AMBASSADORS', label: LOCALE['ngOrcid.outreachResources'] },
          { id: 'GEAR', label: LOCALE['ngOrcid.orcidGear'] },
        ],
      },

      {
        id: 'membership',
        route: LOCALE['public-layout.membership'],
        buttons: [
          { id: 'membership', label: LOCALE['public-layout.membership'] },
          // TODO ADD 'MEMBERSHIP & SUBSCRIPTION'
          { id: 'subscription', label: LOCALE['membershipComparison'] },
          {
            id: 'agreement',
            label: LOCALE['public-layout.standard_member_agreement'],
          },
          { id: 'creator', label: LOCALE['standartCreatorAgreement'] },
          { id: 'our', label: LOCALE['public-layout.our_members'] },
        ],
      },
    ],
  },
  {
    id: 'help',
    label: LOCALE['public-layout.help'],

    buttons: [
      { id: 'help', label: LOCALE['public-layout.help'] },
      { id: 'faq', label: LOCALE['public-layout.faq'] },
      { id: 'contact', label: LOCALE['public-layout.contact_us'] },
      { id: 'feedback', label: LOCALE['public-layout.give_feedback'] },
      { id: 'base', label: LOCALE['public-layout.knowledge_base'] },
    ],
  },
  {
    id: 'signIn',
    label: LOCALE['public-layout.sign_in'],
  },
]
