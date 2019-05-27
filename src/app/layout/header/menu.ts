import { ApplicationMenuItemBasic } from 'src/app/types/menu.local'
import { LOCALE } from '../../../locale/messages.dynamic'

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
        label: 'public-layout.sign_in',
      },
      {
        id: 'register',
        label: 'REGISTER FOR AN ORCID ID',
      },
      {
        id: 'learn',
        label: 'LEARN MORE',
      },
    ],
  },
  {
    id: 'organizations',
    label: 'FOR ORGANIZATIONS',

    buttons: [
      {
        label: 'FOR ORGANIZATIONS',
        id: 'organizations',
      },
      {
        label: 'FUNDERS',
        id: 'funders',

        buttons: [
          {
            label: 'FUNDERS',
            id: 'funders',
          },
          {
            label: 'LEARN MORE',
            id: 'learn',
          },
          {
            label: 'OUTREACH RESOURCES',
            id: 'outreach',
          },
          {
            label: 'MEMBERSHIP',
            id: 'membership',
          },
        ],
      },
      {
        label: 'RESEARCH ORGANIZATIONS  ',
        id: 'research',

        buttons: [
          {
            id: 'research',
            label: 'RESEARCH ORGANIZATIONS',
          },
          {
            id: 'learn',
            label: 'Learn More',
          },
          {
            id: 'outreach',
            label: 'OUTREACH RESOURCES',
          },
          {
            id: 'membership',
            label: 'MEMBERSHIP',
          },
          {
            id: 'use',
            label: 'USE CASES',
          },
        ],
      },
      {
        id: 'publishers',
        label: 'PUBLISHER',

        buttons: [
          {
            id: 'publishers',
            label: 'PUBLISHERS',
          },
          {
            id: 'learn',
            label: 'LEARN MORE',
          },
          {
            id: 'outreach',
            label: 'OUTREACH RESOURCES',
          },
          {
            id: 'membership',
            label: 'MEMBER SHIP',
          },
        ],
      },

      {
        id: 'associations',
        label: 'ASSOCIATIONS',

        buttons: [
          {
            id: 'associations',
            label: 'ASSOCIATIONS',
          },
          {
            id: 'learn',
            label: 'LEARN MORE',
          },
          {
            id: 'outreach',
            label: 'OUTREACH RESOURCES',
          },
          {
            id: 'membership',
            label: 'MEMBERSHIP',
          },
          {
            id: 'use',
            label: 'USE CASES',
          },
        ],
      },

      {
        id: 'integrators',

        label: 'INTEGRATORS',

        buttons: [
          {
            id: 'integrators',
            label: 'INTEGRATORS',
          },
          {
            id: 'api',
            label: 'THE ORCID API',
          },
          {
            id: 'register',
            label: 'REGISTER A CLIENT APPLICATION ',
          },
          {
            id: 'current',
            label: 'CURRENT INTEGRATORS ',
          },
          {
            id: 'chart',
            label: 'INTEGRATION CHART ',
          },
          {
            id: 'beta',
            label: 'BETA TESTERS',
          },
        ],
      },
    ],
  },
  {
    id: 'about',
    label: 'ABOUT',

    buttons: [
      { id: 'about', label: 'ABOUT' },

      {
        id: 'what',
        label: 'WHAT IS ORCID',

        buttons: [
          {
            id: 'what',
            label: 'WHAT IS ORCID',
          },
          {
            id: 'mission',
            label: 'OUR MISSION',
          },
          {
            id: 'principles',
            label: 'OUR PRINCIPLES',
          },
          {
            id: 'governance',
            label: 'OUR GOVERNANCE',
          },
          {
            id: 'policies',
            label: 'OUR POLICIES',
          },
        ],
      },
      { id: 'team', label: 'THE ORCID TEAM' },
      {
        id: 'community',
        label: 'THE ORCID COMMUNITY',

        buttons: [
          { id: 'community', label: 'THE ORCID COMMUNITY' },
          { id: 'groups', label: 'WORKING GROUPS' },
          { id: 'sponsors', label: 'SPONSORS' },
          { id: 'members', label: 'MEMBERS' },
          // TODO CEHCK WHY  'LAUNCH PARTNERS' IS REPEATED,
          { id: 'LAUNCH', label: 'LAUNCH PARTNERS' },
          { id: 'source', label: 'OPEN SOURCE' },
          { id: 'PARTNERS', label: 'PARTNERS' },
          { id: 'ADOPTION', label: 'ADOPTION AND INTEGRATION PROGRAM' },
          { id: 'AMBASSADORS', label: 'AMBASSADORS OUTREACH' },
          { id: 'GEAR', label: 'ORCID GEAR' },
        ],
      },

      {
        id: 'membership',
        route: 'MEMBERSHIP',
        buttons: [
          { id: 'membership', label: 'MEMBERSHIP' },
          // TODO ADD 'MEMBERSHIP & SUBSCRIPTION'
          { id: 'subscription', label: 'MEMBERSHIP COMPARISON' },
          { id: 'comparison', label: 'MEMBERSHIP COMPARISON' },
          { id: 'agreement', label: 'STANDARD MEMBER AGREEMENT' },
          { id: 'creator', label: 'STANDARD CREATOR MEMBER AGREEMENT' },
          { id: 'our', label: 'OUR MEMBERS' },
        ],
      },
    ],
  },
  {
    id: 'help',
    label: 'HELP',

    buttons: [
      { id: 'help', label: 'HELP' },
      { id: 'faq', label: 'FAQ' },
      { id: 'contact', label: 'CONTACT US' },
      { id: 'feedback', label: 'GIVE FEEDBACK' },
      { id: 'base', label: 'KNOWLEDGE BASE' },
    ],
  },
  {
    id: 'signIn',
    label: 'SIGN IN',
  },
]
