import { ApplicationMenuItemBasic } from 'src/app/types/menu.local'
export const menu: ApplicationMenuItemBasic[] = [
  {
    id: 'public-layout.about',
    label: $localize`:@@public-layout.about:About`,
    route: 'about',
    buttons: [
      {
        id: 'about',
        label: $localize`:@@public-layout.about:About`,
        requirements: { desktop: false },
      },

      {
        id: 'what',
        label: $localize`:@@public-layout.what_is_orcid:What is ORCID`,
        route: 'about/what-is-orcid/mission',
        buttons: [
          {
            id: 'what',
            label: $localize`:@@public-layout.what_is_orcid:What is ORCID`,
            route: 'about/what-is-orcid/mission',
          },
          {
            id: 'mission',
            label: $localize`:@@public-layout.our_mission:Our Mission`,
            route: 'about/what-is-orcid/mission',
          },
          {
            id: 'principles',
            label: $localize`:@@public-layout.our_principles:Our Principles`,
            route: 'about/what-is-orcid/our-principles',
          },
          {
            id: 'governance',
            label: $localize`:@@ngOrcid.ourGovernance:OUR GOVERNANCE`,
            route: 'content/our-governance',
          },
          {
            id: 'policies',
            label: $localize`:@@ngOrcid.ourPolicies:OUR POLICIES`,
            buttons: [
              {
                id: 'dispute',
                label: $localize`:@@ngOrcid.disputeProcedures:DISPUTE PROCEDURES`,
                route: 'orcid-dispute-procedures',
              },
              {
                id: 'privacyPolicy',
                label: $localize`:@@change_email_preferences.privacyPolicy:privacy policy`,
                route: 'about/what-is-orcid/policies',
              },
              {
                id: 'terms',
                label: $localize`:@@developer_tools.public_member.terms.check_2:Public Client Terms of Service`,
                route: 'content/orcid-public-client-terms-service',
              },
              {
                id: 'publicData',
                label: $localize`:@@ngOrcid.publicDataFileUsePolicy:PUBLIC DATA FILE USE POLICY`,
                route: 'legal',
              },
              {
                id: 'trademark',
                label: $localize`:@@ngOrcid.trademark2:Trademark and iD Display Guidelines`,
                route: 'trademark-and-id-display-guidelines',
              },
            ],
          },
        ],
      },
      {
        id: 'team',
        label: $localize`:@@public-layout.the_orcid_team:The ORCID Team`,
        route: 'about/team',
      },
      {
        id: 'community',
        label: $localize`:@@public-layout.the_orcid_community:The ORCID Community`,
        route: 'about/community',

        buttons: [
          {
            id: 'community',
            label: $localize`:@@public-layout.the_orcid_community:The ORCID Community`,
            route: 'about/community',
          },
          {
            id: 'groups',
            label: $localize`:@@public-layout.working_groups:Working Groups`,
            route: 'about/community',
          },
          {
            id: 'public-layout.sponsors',
            label: $localize`:@@public-layout.sponsors:Sponsors`,
            route: 'about/community/sponsors',
          },
          {
            id: 'members',
            label: $localize`:@@public-layout.members:Members`,
            route: 'members',
          },
          // TODO CHECK WHY  'LAUNCH PARTNERS' IS REPEATED ON THE ORIGINAL MENU
          {
            id: 'LAUNCH',
            label: $localize`:@@public-layout.launch_partners:Launch Partners`,
            route: 'about/community/launch-partners',
          },
          {
            id: 'source',
            label: $localize`:@@ngOrcid.openSource:OPEN SOURCE`,
            route: 'about/community/orcid-technical-community',
          },
          {
            id: 'PARTNERS',
            label: $localize`:@@ngOrcid.partners:PARTNERS`,
            route: 'content/partners',
          },
          {
            id: 'ADOPTION',
            label: $localize`:@@ngOrcid.adoptionAndInt:ADOPTION AND INTEGRATION PROGRAM`,
            route: 'content/adoption-and-integration-program',
          },

          {
            id: 'AMBASSADORS',
            label: $localize`:@@ngOrcid.ambassadors:Ambassadors`,
            route: 'content/orcid-ambassadors',
          },
          {
            id: 'outreach',
            label: $localize`:@@ngOrcid.outreach:OUTREACH RESOURCES`,
            route: 'content/orcid-ambassadors-1/outreachresources',
          },
          {
            id: 'GEAR',
            label: $localize`:@@ngOrcid.orcidGear:ORCID GEAR`,
            route: 'https://www.cafepress.com/orcid',
          },
        ],
      },

      {
        id: 'membership',
        route: 'about/membership',
        label: $localize`:@@public-layout.membership:Membership`,
        buttons: [
          {
            id: 'membership',
            label: $localize`:@@public-layout.membership:Membership`,
            route: 'about/membership',
          },
          // TODO ADD 'MEMBERSHIP & SUBSCRIPTION' have the same URL as membership

          {
            id: 'subscription',
            label: $localize`:@@ngOrcid.membershipComparison:MEMBERSHIP COMPARISON`,
            route: 'about/membership/comparison',
          },
          {
            id: 'agreement',
            label: $localize`:@@public-layout.standard_member_agreement:Standard Member Agreement`,
            route: 'document/standard-trusted-party-member-agreement',
          },
          {
            id: 'creator',
            label: $localize`:@@ngOrcid.standartCreatorAgreement:STANDARD CREATOR MEMBER AGREEMENT`,
            route: 'document/standard-trusted-party-member-agreement',
          },
          {
            id: 'our',
            label: $localize`:@@public-layout.our_members:Our Members`,
            route: 'members',
          },
        ],
      },
      {
        id: 'public-layout.news',
        label: $localize`:@@public-layout.news:News`,
        route: 'about/news',
        buttons: [
          {
            id: 'news',
            label: $localize`:@@public-layout.news:News`,
            route: 'about/news',
          },
          {
            id: 'blog',
            label: $localize`:@@ngOrcid.blog:BLOG`,
            route: 'category/newsletter/blog',
          },
          {
            id: 'subscribe',
            label: $localize`:@@ngOrcid.subscribe:SUBSCRIBE!`,
            route: 'newsletter/subscriptions',
          },
        ],
      },
      {
        id: 'public-layout.events',
        label: $localize`:@@public-layout.events:Events`,
        route: 'about/events',
      },
    ],
  },
  {
    id: 'public-layout.membership',
    route: 'membership',
    label: $localize`:@@public-layout.membership:Membership`,

    buttons: [
      {
        label: $localize`:@@public-layout.for_organizations:For Organizations`,
        id: 'organizations',
        route: 'organizations',
        requirements: { desktop: false },
      },
      {
        label: $localize`:@@public-layout.funders:Funders`,
        id: 'funders',
        route: 'organizations/funders',

        buttons: [
          {
            label: $localize`:@@public-layout.funders:Funders`,
            id: 'funders',
            route: 'organizations/funders', // TODO
          },
          {
            label: $localize`:@@manage_delegators.learn_more.link.text:Learn more`,
            id: 'learn',
            route: 'organizations/funders/learnmore',
          },
          {
            label: $localize`:@@ngOrcid.outreach:OUTREACH RESOURCES`,
            id: 'outreach',
            route: 'organizations/funders/outreachresources',
          },
          {
            label: $localize`:@@public-layout.membership:Membership`,
            id: 'membership',
            route: 'about/membership',
          },
        ],
      },
      {
        label: $localize`:@@public-layout.research_organizations:Research Organizations`,
        id: 'research',
        route: 'organizations/research-orgs',
        buttons: [
          {
            id: 'research',
            label: $localize`:@@public-layout.research_organizations:Research Organizations`,
            route: 'organizations/research-orgs',
          },
          {
            id: 'learn',
            label: $localize`:@@manage_delegators.learn_more.link.text:Learn more`,
            route: 'organizations/institutions/learnmore',
          },
          {
            id: 'outreach',
            label: $localize`:@@ngOrcid.outreach:OUTREACH RESOURCES`,
            route: 'organizations/institutions/outreachresources',
          },
          {
            id: 'membership',
            label: $localize`:@@public-layout.membership:Membership`,
            route: 'about/membership',
          },
          {
            id: 'use',
            label: $localize`:@@ngOrcid.useCases:USE CASES`,
            route: 'organizations/institutions/usecases',
          },
        ],
      },
      {
        id: 'publishers',
        label: $localize`:@@public-layout.publishers:Publishers`,
        route: 'organizations/publishers',

        buttons: [
          {
            id: 'publishers',
            label: $localize`:@@public-layout.publishers:Publishers`,
            route: 'organizations/publishers',
          },
          {
            id: 'learn',
            label: $localize`:@@manage_delegators.learn_more.link.text:Learn more`,
            route: 'organizations/publishers/learnmore',
          },
          {
            id: 'outreach',
            label: $localize`:@@ngOrcid.outreach:OUTREACH RESOURCES`,
            route: 'organizations/publishers/outreachresources',
          },
          {
            id: 'membership',
            label: $localize`:@@public-layout.membership:Membership`,
            route: 'about/membership',
          },
        ],
      },

      {
        id: 'associations',
        label: $localize`:@@public-layout.associations:Associations`,
        route: 'organizations/associations',

        buttons: [
          {
            id: 'associations',
            label: $localize`:@@public-layout.associations:Associations`,
            route: 'organizations/associations',
          },
          {
            id: 'learn',
            label: $localize`:@@manage_delegators.learn_more.link.text:Learn more`,
            route: 'organizations/associations/learnmore',
          },
          {
            id: 'outreach',
            label: $localize`:@@ngOrcid.outreach:OUTREACH RESOURCES`,
            route: 'organizations/associations/outreachresources',
          },
          {
            id: 'membership',
            label: $localize`:@@public-layout.membership:Membership`,
            route: 'about/membership',
          },
          {
            id: 'use',
            label: $localize`:@@ngOrcid.useCases:USE CASES`,
            route: 'organizations/associations/usecases',
          },
        ],
      },

      {
        id: 'integrators',
        label: $localize`:@@public-layout.integrators:Integrators`,
        route: 'organizations/integrators',
        buttons: [
          {
            id: 'integrators',
            label: $localize`:@@public-layout.integrators:Integrators`,
            route: 'organizations/integrators',
          },
          {
            id: 'api',
            label: $localize`:@@ngOrcid.theOrcidApi:THE ORCID API`,
            route: 'organizations/integrators/API',
          },
          {
            id: 'register',
            label: $localize`:@@ngOrcid.registerClientApp:REGISTER A CLIENT APPLICATION`,
            route: 'content/register-client-application-0',
          },
          {
            id: 'current',
            label: $localize`:@@ngOrcid.currentIntegrations:CURRENT INTEGRATIONS`,
            route: 'members',
          },
          {
            id: 'chart',
            label: $localize`:@@ngOrcid.integrationsChart:INTEGRATION CHART`,
            route: 'organizations/integrators/integration-chart',
          },
          {
            id: 'beta',
            label: $localize`:@@ngOrcid.betaTesters:BETA TESTERS`,
            route: 'content/beta-tester-request',
          },
        ],
      },
    ],
  },
  {
    id: 'public-layout.documentation',
    label: $localize`:@@public-layout.documentation:Documentation`,
    route: 'help',
    buttons: [
      {
        id: 'help',
        label: $localize`:@@public-layout.help:Help`,
        route: 'help',
        requirements: { desktop: false },
      },
      {
        id: 'faq',
        label: $localize`:@@public-layout.faq:FAQ`,
        route: 'https://support.orcid.org/hc',
      },
      {
        id: 'contact',
        label: $localize`:@@public-layout.contact_us:Contact us`,
        route: 'https://support.orcid.org/hc/en-us/requests/new',
      },
      {
        id: 'feedback',
        label: $localize`:@@public-layout.give_feedback:Give Feedback`,
        route: 'https://support.orcid.org/hc/en-us/articles/360006897594',
      },
      {
        id: 'base',
        label: $localize`:@@public-layout.knowledge_base:Knowledge Base`,
        route: 'https://support.orcid.org/hc/en-us',
      },
    ],
  },
  {
    id: 'public-layout.community',
    label: $localize`:@@public-layout.community:Community`,
    route: 'about/what-is-orcid/mission',
  },
  {
    id: 'public-layout.newsEvents',
    label: $localize`:@@public-layout.newsEvents:News & Events`,
    route: 'about/what-is-orcid/mission',
  },
  {
    id: 'public-layout.for_researchers',
    label: $localize`:@@public-layout.for_researchers:For Researchers`,
    route: 'about/what-is-orcid/mission',
    // buttons: [
    //   {
    //     id: 'public-layout.for_researchers',
    //     route: 'about/what-is-orcid/mission',
    //     label: $localize`:@@public-layout.for_researchers`,

    //     requirements: { logging: false, desktop: false },
    //   },
    //   {
    //     route: 'signin',
    //     id: 'public-layout.sign_in',
    //     label: $localize`:@@public-layout.sign_in`,
    //     requirements: { logging: false },
    //   },
    //   {
    //     route: 'register',
    //     id: 'login.registerOrcidId',
    //     label: $localize`:@@login.registerOrcidId`,
    //     requirements: { logging: false },
    //   },
    //   {
    //     id: 'public-layout.my_orcid',
    //     route: 'my-orcid',
    //     label: $localize`:@@public-layout.my_orcid`,
    //     requirements: {
    //       logging: true,
    //       requiresAll: [{ IN_DELEGATION_MODE: 'true' }],
    //     },
    //   },
    //   {
    //     route: 'my-orcid',
    //     id: 'public-layout.my_orcid_record',
    //     label: $localize`:@@public-layout.my_orcid_record`,
    //     requirements: {
    //       logging: true,
    //       requiresAll: [{ IN_DELEGATION_MODE: 'false' }],
    //     },
    //   },
    //   {
    //     route: 'inbox',
    //     id: 'workspace.notifications',
    //     label: $localize`:@@workspace.notifications`,
    //     requirements: { logging: true },
    //   },
    //   {
    //     route: 'account',
    //     id: 'public-layout.account_setting',
    //     label: $localize`:@@public-layout.account_setting`,
    //     requirements: { logging: true },
    //   },
    //   {
    //     route: 'group/developer-tools',
    //     id: 'workspace.developer_tools',
    //     label: $localize`:@@workspace.developer_tools`,
    //     requirements: {
    //       logging: true,
    //       requiresAll: [
    //         {
    //           MEMBER_MENU: 'true',
    //         },
    //       ],
    //       requiresAny: [
    //         {
    //           DELEGATED_BY_ADMIN: 'true',
    //         },
    //         { IN_DELEGATION_MODE: 'false' },
    //       ],
    //     },
    //   },
    //   {
    //     route: 'developer-tools',
    //     id: 'workspace.developer_tools2',
    //     label: $localize`:@@workspace.developer_tools`,
    //     requirements: {
    //       logging: true,
    //       requiresAll: [
    //         {
    //           MEMBER_MENU: 'false',
    //         },
    //       ],
    //       requiresAny: [
    //         {
    //           DELEGATED_BY_ADMIN: 'true',
    //         },
    //         { IN_DELEGATION_MODE: 'false' },
    //       ],
    //     },
    //   },
    //   {
    //     route: 'manage-members',
    //     id: 'admin.members.workspace_link',
    //     label: $localize`:@@admin.members.workspace_link`,
    //     requirements: {
    //       logging: true,
    //       requiresAll: [
    //         {
    //           ADMIN_MENU: 'true',
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     route: 'admin-actions',
    //     id: 'admin.workspace_link',
    //     label: $localize`:@@admin.workspace_link`,
    //     requirements: {
    //       logging: true,
    //       requiresAll: [
    //         {
    //           ADMIN_MENU: 'true',
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     route: 'self-service',
    //     id: 'workspace.self_service',
    //     label: $localize`:@@workspace.self_service`,
    //     requirements: {
    //       logging: true,
    //       requiresAll: [
    //         {
    //           SELF_SERVICE_MENU: 'true',
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     route: 'content/initiative',
    //     id: 'manage_delegators.learn_more.link.text',
    //     label: $localize`:@@manage_delegators.learn_more.link.text`,
    //     requirements: {
    //       logging: true,
    //     },
    //   },
    //   {
    //     route: 'about/what-is-orcid/mission',
    //     id: 'manage_delegators.learn_more.link.text',
    //     label: $localize`:@@manage_delegators.learn_more.link.text`,
    //     requirements: {
    //       logging: false,
    //     },
    //   },
    // ],
  },
  {
    id: 'public-layout.sign_in',
    label: $localize`:@@public-layout.sign_in:SIGN IN`,
    requirements: {
      desktop: true,
      logging: false,
      togglz: { ENABLE_USER_MENU: 'false' },
    },
    route: 'signin',
  },
  {
    id: 'public-layout.sign_out',
    label: $localize`:@@public-layout.sign_out:SIGN OUT`,
    requirements: {
      desktop: true,
      logging: true,
      togglz: { ENABLE_USER_MENU: 'false' },
    },
    route: 'signout',
  },
]
