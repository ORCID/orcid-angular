import { ApplicationMenuItemBasic } from 'src/app/types/menu.local'
import { LOCALE } from '../../../locale/messages.dynamic.en'

export const menu: ApplicationMenuItemBasic[] = [
  {
    id: 'public-layout.for_researchers',
    label: LOCALE['public-layout.for_researchers'],
    route: 'about/what-is-orcid/mission',
    activeRoute: '',
    buttons: [
      {
        id: 'public-layout.for_researchers',
        route: 'about/what-is-orcid/mission',
        label: LOCALE['public-layout.for_researchers'],

        requirements: { logging: false, desktop: false },
      },
      {
        route: 'signin',
        id: 'public-layout.sign_in',
        label: LOCALE['public-layout.sign_in'],
        requirements: { logging: false },
      },
      {
        route: 'register',
        id: 'login.registerOrcidId',
        label: LOCALE['login.registerOrcidId'],
        requirements: { logging: false },
      },
      {
        id: 'public-layout.my_orcid',
        route: 'my-orcid',
        label: LOCALE['public-layout.my_orcid'],
        requirements: {
          logging: true,
          requiresAll: [{ IN_DELEGATION_MODE: 'true' }],
        },
      },
      {
        route: 'my-orcid',
        id: 'public-layout.my_orcid_record',
        label: LOCALE['public-layout.my_orcid_record'],
        requirements: {
          logging: true,
          requiresAll: [{ IN_DELEGATION_MODE: 'false' }],
        },
      },
      {
        route: 'inbox',
        id: 'workspace.notifications',
        label: LOCALE['workspace.notifications'],
        requirements: { logging: true },
      },
      {
        route: 'account',
        id: 'public-layout.account_setting',
        label: LOCALE['public-layout.account_setting'],
        requirements: { logging: true },
      },
      {
        route: 'group/developer-tools',
        id: 'workspace.developer_tools',
        label: LOCALE['workspace.developer_tools'],
        requirements: {
          logging: true,
          requiresAll: [
            {
              MEMBER_MENU: 'true',
            },
          ],
          requiresAny: [
            {
              DELEGATED_BY_ADMIN: 'true',
            },
            { IN_DELEGATION_MODE: 'false' },
          ],
        },
      },
      {
        route: 'developer-tools',
        id: 'workspace.developer_tools2',
        label: LOCALE['workspace.developer_tools'],
        requirements: {
          logging: true,
          requiresAll: [
            {
              MEMBER_MENU: 'false',
            },
          ],
          requiresAny: [
            {
              DELEGATED_BY_ADMIN: 'true',
            },
            { IN_DELEGATION_MODE: 'false' },
          ],
        },
      },
      {
        route: 'manage-members',
        id: 'admin.members.workspace_link',
        label: LOCALE['admin.members.workspace_link'],
        requirements: {
          logging: true,
          requiresAll: [
            {
              ADMIN_MENU: 'true',
            },
          ],
        },
      },
      {
        route: 'admin-actions',
        id: 'admin.workspace_link',
        label: LOCALE['admin.workspace_link'],
        requirements: {
          logging: true,
          requiresAll: [
            {
              ADMIN_MENU: 'true',
            },
          ],
        },
      },
      {
        route: 'self-service',
        id: 'workspace.self_service',
        label: LOCALE['workspace.self_service'],
        requirements: {
          logging: true,
          requiresAll: [
            {
              SELF_SERVICE_MENU: 'true',
            },
          ],
        },
      },
      {
        route: 'content/initiative',
        id: 'manage_delegators.learn_more.link.text',
        label: LOCALE['manage_delegators.learn_more.link.text'],
        requirements: {
          logging: true,
        },
      },
      {
        route: 'about/what-is-orcid/mission',
        id: 'manage_delegators.learn_more.link.text',
        label: LOCALE['manage_delegators.learn_more.link.text'],
        requirements: {
          logging: false,
        },
      },
    ],
  },
  {
    id: 'organizations',
    route: 'organizations',
    label: LOCALE['public-layout.for_organizations'],

    buttons: [
      {
        label: LOCALE['public-layout.for_organizations'],
        id: 'organizations',
        route: 'organizations',
        requirements: { desktop: false },
      },
      {
        label: LOCALE['public-layout.funders'],
        id: 'funders',
        route: 'organizations/funders',

        buttons: [
          {
            label: LOCALE['public-layout.funders'],
            id: 'funders',
            route: 'organizations/funders', // TODO
          },
          {
            label: LOCALE['manage_delegators.learn_more.link.text'],
            id: 'learn',
            route: 'organizations/funders/learnmore',
          },
          {
            label: LOCALE['ngOrcid.outreach'],
            id: 'outreach',
            route: 'organizations/funders/outreachresources',
          },
          {
            label: LOCALE['public-layout.membership'],
            id: 'membership',
            route: 'about/membership',
          },
        ],
      },
      {
        label: LOCALE['public-layout.research_organizations'],
        id: 'research',
        route: 'organizations/research-orgs',
        buttons: [
          {
            id: 'research',
            label: LOCALE['public-layout.research_organizations'],
            route: 'organizations/research-orgs',
          },
          {
            id: 'learn',
            label: LOCALE['manage_delegators.learn_more.link.text'],
            route: 'organizations/institutions/learnmore',
          },
          {
            id: 'outreach',
            label: LOCALE['ngOrcid.outreach'],
            route: 'organizations/institutions/outreachresources',
          },
          {
            id: 'membership',
            label: LOCALE['public-layout.membership'],
            route: 'about/membership',
          },
          {
            id: 'use',
            label: LOCALE['ngOrcid.useCases'],
            route: 'organizations/institutions/usecases',
          },
        ],
      },
      {
        id: 'publishers',
        label: LOCALE['public-layout.publishers'],
        route: 'organizations/publishers',

        buttons: [
          {
            id: 'publishers',
            label: LOCALE['public-layout.publishers'],
            route: 'organizations/publishers',
          },
          {
            id: 'learn',
            label: LOCALE['manage_delegators.learn_more.link.text'],
            route: 'organizations/publishers/learnmore',
          },
          {
            id: 'outreach',
            label: LOCALE['ngOrcid.outreach'],
            route: 'organizations/publishers/outreachresources',
          },
          {
            id: 'membership',
            label: LOCALE['public-layout.membership'],
            route: 'about/membership',
          },
        ],
      },

      {
        id: 'associations',
        label: LOCALE['public-layout.associations'],
        route: 'organizations/associations',

        buttons: [
          {
            id: 'associations',
            label: LOCALE['public-layout.associations'],
            route: 'organizations/associations',
          },
          {
            id: 'learn',
            label: LOCALE['manage_delegators.learn_more.link.text'],
            route: 'organizations/associations/learnmore',
          },
          {
            id: 'outreach',
            label: LOCALE['ngOrcid.outreach'],
            route: 'organizations/associations/outreachresources',
          },
          {
            id: 'membership',
            label: LOCALE['public-layout.membership'],
            route: 'about/membership',
          },
          {
            id: 'use',
            label: LOCALE['ngOrcid.useCases'],
            route: 'organizations/associations/usecases',
          },
        ],
      },

      {
        id: 'integrators',
        label: LOCALE['public-layout.integrators'],
        route: 'organizations/integrators',
        buttons: [
          {
            id: 'integrators',
            label: LOCALE['public-layout.integrators'],
            route: 'organizations/integrators',
          },
          {
            id: 'api',
            label: LOCALE['ngOrcid.theOrcidApi'],
            route: 'organizations/integrators/API',
          },
          {
            id: 'register',
            label: LOCALE['ngOrcid.registerClientApp'],
            route: 'content/register-client-application-0',
          },
          {
            id: 'current',
            label: LOCALE['ngOrcid.currentIntegrations'],
            route: 'members',
          },
          {
            id: 'chart',
            label: LOCALE['ngOrcid.integrationsChart'],
            route: 'organizations/integrators/integration-chart',
          },
          {
            id: 'beta',
            label: LOCALE['ngOrcid.betaTesters'],
            route: 'content/beta-tester-request',
          },
        ],
      },
    ],
  },
  {
    id: 'about',
    label: LOCALE['public-layout.about'],
    route: 'about',

    buttons: [
      {
        id: 'about',
        label: LOCALE['public-layout.about'],
        requirements: { desktop: false },
      },

      {
        id: 'what',
        label: LOCALE['public-layout.what_is_orcid'],
        route: 'about/what-is-orcid/mission',
        buttons: [
          {
            id: 'what',
            label: LOCALE['public-layout.what_is_orcid'],
            route: 'about/what-is-orcid/mission',
          },
          {
            id: 'mission',
            label: LOCALE['public-layout.our_mission'],
            route: 'about/what-is-orcid/mission',
          },
          {
            id: 'principles',
            label: LOCALE['public-layout.our_principles'],
            route: 'about/what-is-orcid/our-principles',
          },
          {
            id: 'governance',
            label: LOCALE['ngOrcid.ourGovernance'],
            route: 'content/our-governance',
          },
          {
            id: 'policies',
            label: LOCALE['ngOrcid.ourPolicies'],
            buttons: [
              {
                id: 'dispute',
                label: LOCALE['ngOrcid.disputeProcedures'],
                route: 'orcid-dispute-procedures',
              },
              {
                id: 'privacyPolicy',
                label: LOCALE['change_email_preferences.privacyPolicy'],
                route: 'about/what-is-orcid/policies',
              },
              {
                id: 'terms',
                label: LOCALE['developer_tools.public_member.terms.check_2'],
                route: 'content/orcid-public-client-terms-service',
              },
              {
                id: 'publicData',
                label: LOCALE['ngOrcid.publicDataFileUsePolicy'],
                route: 'legal',
              },
              {
                id: 'trademark',
                label: LOCALE['ngOrcid.trademark2'],
                route: 'trademark-and-id-display-guidelines',
              },
            ],
          },
        ],
      },
      {
        id: 'team',
        label: LOCALE['public-layout.the_orcid_team'],
        route: 'about/team',
      },
      {
        id: 'community',
        label: LOCALE['public-layout.the_orcid_community'],
        route: 'about/community',

        buttons: [
          {
            id: 'community',
            label: LOCALE['public-layout.the_orcid_community'],
            route: 'about/community',
          },
          {
            id: 'groups',
            label: LOCALE['public-layout.working_groups'],
            route: 'about/community',
          },
          {
            id: 'public-layout.sponsors',
            label: LOCALE['public-layout.sponsors'],
            route: 'about/community/sponsors',
          },
          {
            id: 'members',
            label: LOCALE['public-layout.members'],
            route: 'members',
          },
          // TODO CHECK WHY  'LAUNCH PARTNERS' IS REPEATED ON THE ORIGINAL MENU
          {
            id: 'LAUNCH',
            label: LOCALE['public-layout.launch_partners'],
            route: 'about/community/launch-partners',
          },
          {
            id: 'source',
            label: LOCALE['ngOrcid.openSource'],
            route: 'about/community/orcid-technical-community',
          },
          {
            id: 'PARTNERS',
            label: LOCALE['ngOrcid.partners'],
            route: 'content/partners',
          },
          {
            id: 'ADOPTION',
            label: LOCALE['ngOrcid.adoptionAndInt'],
            route: 'content/adoption-and-integration-program',
          },

          {
            id: 'AMBASSADORS',
            label: LOCALE['ngOrcid.ambassadors'],
            route: 'content/orcid-ambassadors',
          },
          {
            id: 'outreach',
            label: LOCALE['ngOrcid.outreach'],
            route: 'content/orcid-ambassadors-1/outreachresources',
          },
          {
            id: 'GEAR',
            label: LOCALE['ngOrcid.orcidGear'],
            route: 'https://www.cafepress.com/orcid',
          },
        ],
      },

      {
        id: 'membership',
        route: 'about/membership',
        label: LOCALE['public-layout.membership'],
        buttons: [
          {
            id: 'membership',
            label: LOCALE['public-layout.membership'],
            route: 'about/membership',
          },
          // TODO ADD 'MEMBERSHIP & SUBSCRIPTION' have the same URL as membership

          {
            id: 'subscription',
            label: LOCALE['ngOrcid.membershipComparison'],
            route: 'about/membership/comparison',
          },
          {
            id: 'agreement',
            label: LOCALE['public-layout.standard_member_agreement'],
            route: 'document/standard-trusted-party-member-agreement',
          },
          {
            id: 'creator',
            label: LOCALE['ngOrcid.standartCreatorAgreement'],
            route: 'document/standard-trusted-party-member-agreement',
          },
          {
            id: 'our',
            label: LOCALE['public-layout.our_members'],
            route: 'members',
          },
        ],
      },
      {
        id: 'public-layout.news',
        label: LOCALE['public-layout.news'],
        route: 'about/news',
        buttons: [
          {
            id: 'news',
            label: LOCALE['public-layout.news'],
            route: 'about/news',
          },
          {
            id: 'blog',
            label: LOCALE['ngOrcid.blog'],
            route: 'category/newsletter/blog',
          },
          {
            id: 'subscribe',
            label: LOCALE['ngOrcid.subscribe'],
            route: 'newsletter/subscriptions',
          },
        ],
      },
      {
        id: 'public-layout.events',
        label: LOCALE['public-layout.events'],
        route: 'about/events',
      },
    ],
  },
  {
    id: 'help',
    label: LOCALE['public-layout.help'],
    route: 'help',

    buttons: [
      {
        id: 'help',
        label: LOCALE['public-layout.help'],
        route: 'help',
        requirements: { desktop: false },
      },
      {
        id: 'faq',
        label: LOCALE['public-layout.faq'],
        route: 'https://support.orcid.org/hc',
      },
      {
        id: 'contact',
        label: LOCALE['public-layout.contact_us'],
        route: 'https://support.orcid.org/hc/en-us/requests/new',
      },
      {
        id: 'feedback',
        label: LOCALE['public-layout.give_feedback'],
        route: 'https://support.orcid.org/hc/en-us/community/topics',
      },
      {
        id: 'base',
        label: LOCALE['public-layout.knowledge_base'],
        route: 'https://support.orcid.org/hc/en-us',
      },
    ],
  },
  {
    id: 'public-layout.sign_in',
    label: LOCALE['public-layout.sign_in'],
    requirements: {
      desktop: true,
      logging: false,
      togglz: [{ ENABLE_USER_MENU: 'false' }],
    },
    route: 'signin',
  },
  {
    id: 'public-layout.sign_out',
    label: LOCALE['public-layout.sign_out'],
    requirements: {
      desktop: true,
      logging: true,
      togglz: [{ ENABLE_USER_MENU: 'false' }],
    },
    route: 'signout',
  },
]
