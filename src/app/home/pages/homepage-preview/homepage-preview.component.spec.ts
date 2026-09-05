import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WINDOW } from 'src/app/cdk/window'
import { HomepageContent } from 'src/app/types/homepage-content.v2'
import { HomepagePreviewComponent } from './homepage-preview.component'

describe('HomepagePreviewComponent', () => {
  let fixture: ComponentFixture<HomepagePreviewComponent>
  let component: HomepagePreviewComponent
  let listeners: Array<(event: MessageEvent) => void>
  let posted: Array<{ target: string; message: unknown }>
  let parentWindow: Window
  let topWindow: Window
  let windowStub: any

  function content(): HomepageContent {
    return {
      schemaVersion: 2,
      catalogueVersion: 1,
      page: { title: 'ORCID is for…', description: 'One sentence.' },
      sections: [
        {
          id: 'who-we-serve',
          type: 'audience-selector',
          variant: 'tabs-photo',
          layout: { span: 'full', spacing: 'normal', tone: 'brand-dark' },
          audiences: [
            {
              id: 'researchers',
              label: 'Researchers',
              intro: 'Intro',
              features: [
                { id: 'uniquely-yours', title: 'Uniquely Yours', body: 'Body' },
              ],
            },
          ],
        },
      ],
    }
  }

  function send(message: unknown, source: Window | null) {
    for (const listener of listeners) {
      listener({ data: message, source } as MessageEvent)
    }
    fixture.detectChanges()
  }

  beforeEach(() => {
    listeners = []
    posted = []
    parentWindow = {
      postMessage: (message: unknown) =>
        posted.push({ target: 'parent', message }),
    } as unknown as Window
    topWindow = {
      postMessage: (message: unknown) =>
        posted.push({ target: 'top', message }),
    } as unknown as Window

    windowStub = {
      parent: parentWindow,
      top: topWindow,
      addEventListener: (name: string, handler: (e: MessageEvent) => void) => {
        if (name === 'message') listeners.push(handler)
      },
      removeEventListener: (
        name: string,
        handler: (e: MessageEvent) => void
      ) => {
        if (name === 'message') {
          listeners = listeners.filter((l) => l !== handler)
        }
      },
    }

    TestBed.configureTestingModule({
      declarations: [HomepagePreviewComponent],
      providers: [{ provide: WINDOW, useValue: windowStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })

    fixture = TestBed.createComponent(HomepagePreviewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('waits for the editor before rendering anything', () => {
    expect(component.content).toBeUndefined()
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Waiting for the editor'
    )
  })

  it('announces itself to the embedder so it is sent the current draft', () => {
    expect(posted.map((p) => p.target)).toEqual(['parent', 'top'])
    expect(posted[0].message).toEqual({
      type: 'orcid-homepage-preview-ready',
    })
  })

  it('renders a draft that arrives from the parent frame', () => {
    send({ type: 'orcid-homepage-preview', content: content() }, parentWindow)

    expect(component.content?.page.title).toBe('ORCID is for…')
    const element = fixture.nativeElement as HTMLElement
    expect(element.querySelector('app-homepage-page')).toBeTruthy()
  })

  it('renders a draft that arrives from the outermost window', () => {
    send({ type: 'orcid-homepage-preview', content: content() }, topWindow)
    expect(component.content).toBeTruthy()
  })

  it('ignores a message from anywhere else', () => {
    send({ type: 'orcid-homepage-preview', content: content() }, {
      postMessage: () => undefined,
    } as unknown as Window)
    expect(component.content).toBeUndefined()
  })

  it('ignores messages that are not a draft', () => {
    send({ type: 'something-else', content: content() }, parentWindow)
    send(null, parentWindow)
    send('a string', parentWindow)
    expect(component.content).toBeUndefined()
  })

  it('explains itself rather than rendering a draft it cannot use', () => {
    const unusable = content() as any
    unusable.page = undefined
    send({ type: 'orcid-homepage-preview', content: unusable }, parentWindow)

    expect(component.content).toBeUndefined()
    expect(component.problem).toContain('cannot be shown')
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('app-homepage-page')
    ).toBeNull()
  })

  it('replaces the previous draft on every update', () => {
    send({ type: 'orcid-homepage-preview', content: content() }, parentWindow)

    const updated = content()
    updated.page.title = 'ORCID is for everyone'
    send({ type: 'orcid-homepage-preview', content: updated }, parentWindow)

    expect(component.content?.page.title).toBe('ORCID is for everyone')
  })

  it('stops listening once it goes away', () => {
    expect(listeners.length).toBe(1)
    fixture.destroy()
    expect(listeners.length).toBe(0)
  })
})
