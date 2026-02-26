import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SearchLinkWizardComponent } from './search-link-wizard.component'
import { RecordImportWizard } from '../../../types/record-peer-review-import.endpoint'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

declare const runtimeEnvironment: { BASE_URL: string }

describe('SearchLinkWizardComponent', () => {
  let component: SearchLinkWizardComponent
  let fixture: ComponentFixture<SearchLinkWizardComponent>

  beforeEach(async () => {
    ;(window as any).runtimeEnvironment = { BASE_URL: 'https://example.org/' }
    await TestBed.configureTestingModule({
      declarations: [SearchLinkWizardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLinkWizardComponent)
    component = fixture.componentInstance
    component.recordImportWizards = []
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('openImportWizardUrlFilter', () => {
    it('returns clientWebsite when client is connected', () => {
      const client: RecordImportWizard = {
        id: 'client-1',
        name: 'Test',
        redirectUri: 'https://app.example/cb',
        scopes: 'scope1',
        isConnected: true,
        clientWebsite: 'https://connected.example',
      }
      expect(component.openImportWizardUrlFilter(client)).toBe(
        'https://connected.example'
      )
    })

    it('returns clientWebsite when status is RETIRED', () => {
      const client: RecordImportWizard = {
        id: 'client-2',
        name: 'Retired',
        redirectUri: 'https://app.example/cb',
        scopes: 'scope1',
        status: 'RETIRED',
        clientWebsite: 'https://retired.example',
      }
      expect(component.openImportWizardUrlFilter(client)).toBe(
        'https://retired.example'
      )
    })

    it('builds OAuth authorize URL when not connected and not retired', () => {
      const client: RecordImportWizard = {
        id: 'my-client',
        name: 'OAuth App',
        redirectUri: 'https://app.example/callback',
        scopes: '/read-limited',
      }
      const url = component.openImportWizardUrlFilter(client)
      expect(url).toContain('https://example.org/oauth/authorize')
      expect(url).toContain('client_id=my-client')
      expect(url).toContain('response_type=code')
      expect(url).toContain('scope=' + encodeURIComponent('/read-limited'))
      expect(url).toContain(
        'redirect_uri=' + encodeURIComponent('https://app.example/callback')
      )
    })
  })

  describe('toggle', () => {
    it('flips show from false to true', () => {
      const wizard: RecordImportWizard = {
        id: 'w',
        name: 'W',
        redirectUri: 'https://u',
        scopes: 's',
        show: false,
      }
      component.toggle(wizard)
      expect(wizard.show).toBe(true)
    })

    it('flips show from true to false', () => {
      const wizard: RecordImportWizard = {
        id: 'w',
        name: 'W',
        redirectUri: 'https://u',
        scopes: 's',
        show: true,
      }
      component.toggle(wizard)
      expect(wizard.show).toBe(false)
    })
  })
})
