import { ApplicationMenuItemBasic } from 'src/app/types/menu.local'
export const menu: ApplicationMenuItemBasic[] = [
  {
    id: 'public-layout.about',
    label: $localize`:@@public-layout.about:About`,
    route: 'what-is-orcid',
  },
  {
    id: 'public-layout.for_researchers',
    label: $localize`:@@public-layout.for_researchers:For Researchers`,
    route: 'benefits-for-researchers',
  },
  {
    id: 'public-layout.membership',
    label: $localize`:@@public-layout.membership:Membership`,
    route: 'about-membership',
  },
  {
    id: 'public-layout.documentation',
    label: $localize`:@@public-layout.documentation:Documentation`,
    route: 'documentation',
  },
  {
    id: 'public-layout.resources',
    label: $localize`:@@public-layout.resources:Resources`,
    route: 'resources',
  },

  {
    id: 'public-layout.newsEvents',
    label: $localize`:@@public-layout.newsEvents:News & Events`,
    route: '',
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
