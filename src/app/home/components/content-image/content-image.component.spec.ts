import { Direction, Directionality } from '@angular/cdk/bidi'
import { Component, EventEmitter, ViewChild } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import {
  DecorativeImage,
  InformativeImage,
} from 'src/app/types/homepage-content.v2'

import { ContentImageComponent } from './content-image.component'

@Component({
  standalone: true,
  imports: [ContentImageComponent],
  template: `
    <app-content-image
      [image]="image"
      [decorative]="decorative"
      [itemId]="itemId"
      [width]="width"
      [height]="height"
    ></app-content-image>
  `,
})
class HostComponent {
  image: DecorativeImage | InformativeImage = { src: 'images/photo.png' }
  decorative = true
  itemId = 'item-1'
  width?: number
  height?: number
  @ViewChild(ContentImageComponent) contentImage!: ContentImageComponent
}

describe('ContentImageComponent', () => {
  async function createFixture(
    dir: Direction = 'ltr'
  ): Promise<ComponentFixture<HostComponent>> {
    TestBed.resetTestingModule()
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        {
          provide: Directionality,
          useValue: { value: dir, change: new EventEmitter<Direction>() },
        },
      ],
    }).compileComponents()

    return TestBed.createComponent(HostComponent)
  }

  function img(
    fixture: ComponentFixture<HostComponent>
  ): HTMLImageElement | null {
    return (fixture.nativeElement as HTMLElement).querySelector('img')
  }

  function host(fixture: ComponentFixture<HostComponent>): HTMLElement {
    return (fixture.nativeElement as HTMLElement).querySelector(
      'app-content-image'
    ) as HTMLElement
  }

  describe('a decorative image', () => {
    it('is hidden from the accessibility tree', async () => {
      const fixture = await createFixture()
      fixture.componentInstance.image = { src: 'images/swirl.png' }
      fixture.componentInstance.decorative = true
      fixture.detectChanges()

      expect(img(fixture)?.getAttribute('alt')).toBe('')
      expect(img(fixture)?.getAttribute('aria-hidden')).toBe('true')
    })

    it('stays silent even when the content carries alt text', async () => {
      const fixture = await createFixture()
      // The slot decides, never the editor's memory: a background photo
      // reused from an informative slot must not start announcing itself.
      fixture.componentInstance.image = {
        src: 'images/swirl.png',
        alt: 'A researcher at a laptop',
      } as InformativeImage
      fixture.componentInstance.decorative = true
      fixture.detectChanges()

      expect(img(fixture)?.getAttribute('alt')).toBe('')
      expect(img(fixture)?.getAttribute('aria-hidden')).toBe('true')
    })
  })

  describe('an informative image', () => {
    it('announces the alt text the editor wrote', async () => {
      const fixture = await createFixture()
      fixture.componentInstance.image = {
        src: 'images/team.png',
        alt: 'Two researchers comparing records',
      }
      fixture.componentInstance.decorative = false
      fixture.detectChanges()

      expect(img(fixture)?.getAttribute('alt')).toBe(
        'Two researchers comparing records'
      )
      expect(img(fixture)?.getAttribute('aria-hidden')).toBeNull()
    })

    it('renders no image at all when the alt text is missing', async () => {
      const fixture = await createFixture()
      fixture.componentInstance.image = {
        src: 'images/team.png',
      } as InformativeImage
      fixture.componentInstance.decorative = false
      fixture.detectChanges()

      expect(img(fixture)).toBeNull()
    })

    it('renders no image when the alt text is only whitespace', async () => {
      const fixture = await createFixture()
      fixture.componentInstance.image = { src: 'images/team.png', alt: '   ' }
      fixture.componentInstance.decorative = false
      fixture.detectChanges()

      expect(img(fixture)).toBeNull()
    })

    it('marks the slot so the CMS preview can highlight it', async () => {
      const fixture = await createFixture()
      fixture.componentInstance.image = {
        src: 'images/team.png',
      } as InformativeImage
      fixture.componentInstance.decorative = false
      fixture.detectChanges()

      expect(host(fixture).getAttribute('data-a11y-error')).toBe('missing-alt')
    })

    it('names the offending item once in the console', async () => {
      const warn = spyOn(console, 'warn')
      const fixture = await createFixture()
      fixture.componentInstance.image = {
        src: 'images/team.png',
      } as InformativeImage
      fixture.componentInstance.decorative = false
      fixture.componentInstance.itemId = 'audience-researchers'
      fixture.detectChanges()
      fixture.detectChanges()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn.calls.mostRecent().args[0]).toContain('audience-researchers')
    })

    it('carries no error marker once the alt text is there', async () => {
      const fixture = await createFixture()
      fixture.componentInstance.image = {
        src: 'images/team.png',
        alt: 'Two researchers',
      }
      fixture.componentInstance.decorative = false
      fixture.detectChanges()

      expect(host(fixture).getAttribute('data-a11y-error')).toBeNull()
    })
  })

  describe('the crop', () => {
    async function positionFor(
      focalPoint: DecorativeImage['focalPoint'],
      dir: Direction
    ): Promise<string> {
      const fixture = await createFixture(dir)
      fixture.componentInstance.image = { src: 'images/photo.png', focalPoint }
      fixture.componentInstance.decorative = true
      fixture.detectChanges()

      return img(fixture)!.style.objectPosition
    }

    it('fills its box without distorting the photograph', async () => {
      const fixture = await createFixture()
      fixture.detectChanges()

      expect(getComputedStyle(img(fixture)!).objectFit).toBe('cover')
    })

    it('centres the crop when no focal point is given', async () => {
      expect(await positionFor(undefined, 'ltr')).toBe('50% 50%')
    })

    it('keeps top and bottom the same in both directions', async () => {
      expect(await positionFor('top', 'ltr')).toBe('50% 0%')
      expect(await positionFor('top', 'rtl')).toBe('50% 0%')
      expect(await positionFor('bottom', 'rtl')).toBe('50% 100%')
    })

    it('crops towards the reading edge, so start is right in Arabic', async () => {
      expect(await positionFor('start', 'ltr')).toBe('0% 50%')
      expect(await positionFor('start', 'rtl')).toBe('100% 50%')
    })

    it('crops end towards the trailing edge in both directions', async () => {
      expect(await positionFor('end', 'ltr')).toBe('100% 50%')
      expect(await positionFor('end', 'rtl')).toBe('0% 50%')
    })
  })

  describe('layout stability', () => {
    it('reserves space when intrinsic dimensions are supplied', async () => {
      const fixture = await createFixture()
      fixture.componentInstance.width = 640
      fixture.componentInstance.height = 360
      fixture.detectChanges()

      expect(img(fixture)?.getAttribute('width')).toBe('640')
      expect(img(fixture)?.getAttribute('height')).toBe('360')
    })

    it('omits the dimensions rather than guessing them', async () => {
      const fixture = await createFixture()
      fixture.detectChanges()

      expect(img(fixture)?.getAttribute('width')).toBeNull()
      expect(img(fixture)?.getAttribute('height')).toBeNull()
    })
  })

  it('paints the picture as an element, never as a background', async () => {
    // A CSS background-image is dropped in Windows forced-colors mode, taking
    // the picture with it. Nothing here may rely on one.
    const fixture = await createFixture()
    fixture.detectChanges()

    expect(getComputedStyle(host(fixture)).backgroundImage).toBe('none')
    expect(getComputedStyle(img(fixture)!).backgroundImage).toBe('none')
    expect(img(fixture)?.getAttribute('src')).toBe('images/photo.png')
  })

  it('is a block so it does not collapse inside a flex grid column', async () => {
    const fixture = await createFixture()
    fixture.detectChanges()

    expect(getComputedStyle(host(fixture)).display).toBe('block')
  })
})
