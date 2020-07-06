import {
  animate,
  animateChild,
  query,
  stagger,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations'

export const rotateAnimation = trigger('rotateAnimation', [
  state('*', style({ transform: 'rotate(0deg)' })),
  state('open', style({ transform: 'rotate(180deg)' })),
  transition('open => close', animate('200ms ease-out')),
  transition('close => open', animate('200ms ease-in')),
])

export const heightAnimation = [
  trigger('heightAnimationState', [
    state(
      '*',
      style({
        height: '0px',
      })
    ),
    state(
      'open',
      style({
        height: '*',
      })
    ),
    transition('* => open', [animate(100, style({ height: '*' }))]),
    transition('open => *', animate(100, style({ height: '0px' }))),
  ]),
]

// heightAnimationDefaultOpen animations is used as a quick fix for the following Angular animations issue
// https://github.com/angular/angular/issues/18847
// The problem:
// When a list display by a ngFor is reordered, the animation state of the repositioned
// elements are going to change to void, this only happens the first time the element is moved.
// The solution:
// When an animation witch initial state is open, 'heightAnimationDefaultOpen' should be used.
// When an animation witch initial state is close.  'heightAnimation' should be used.
// The behavior:
// This is going to prevent strange behaviors like wrongly expanding an element (which current state should be close)
// after it's container list is reordered. Or wrongly close an element (witch current state should be open) after it's containing
// list is reordered.
// The secondary effects:
// If an elements witch default state is close, but the user first opens this element and after that reorders the containing list,
// this element is going to appear closed. Or vice versa for default open elements.
// This only happens on the first reorder action, and the component state of the element should be updated on
// the component when a state change from something to void  `*<=>void`.

export const heightAnimationDefaultOpen = [
  trigger('heightAnimationDefaultOpenState', [
    state(
      'close',
      style({
        height: '0px',
        'max-width': '0',
        opacity: '0',
        overflow: 'hidden',
      })
    ),
    state(
      '*',
      style({
        height: '*',
        opacity: '1',
      })
    ),
    state(
      'close-with-none-opacity',
      style({
        height: '0px',
        opacity: '1',
        overflow: 'hidden',
      })
    ),
    transition('* => open', [style({ height: '0px' }), animate(200)], {}),
    transition('open => *', [
      style({
        opacity: '0.37',
      }),
      animate(200),
    ]),
  ]),
]

export const opacityAnimation = [
  trigger('opacityAnimationState', [
    state(
      'close, void',
      style({
        height: '0px',
        opacity: '0',
        overflow: 'hidden',
      })
    ),
    state(
      'open',
      style({
        opacity: '1',
        height: '*',
      })
    ),
    transition('close => open', animate('200ms')),
    transition('open => close', animate('200ms')),
  ]),
]

export const listAnimation = trigger('listAnimation', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0 }),
      stagger(50, [animate('0.2s', style({ opacity: 1 }))]),
    ]),
  ]),
])

export const nestedListAnimation = [
  trigger('itemChildListAnimation', [
    // leave animation is temporally disable due to angular open issue
    // https://github.com/angular/angular/issues/18847
    // The problem:
    // When a list display by a ngFor is reordered, the animation state of the repositioned
    // elements are going to change to void, this only happens the first time the element is moved.
    //
    // transition(':leave', [
    //   style({ opacity: 0, padding: '*', overflow: 'hidden' }),
    //   animate('200ms', style({ opacity: 0, height: '0px', padding: 0 })),
    // ]),
  ]),
  trigger('childListAnimation', [
    // Afther the list is reordered
    transition('void => *', [
      query(
        '@itemChildListAnimation',
        [style({ opacity: 0 }), animate('0.2s', style({ opacity: 1 }))],
        { optional: true }
      ),
    ]),
  ]),
  trigger('parentListAnimation', [
    transition('*=>*', [
      query(':enter', [
        style({ opacity: 0 }),
        animate('0.2s', style({ opacity: 1 })),
        query('@childListAnimation', animateChild(), { optional: true }),
      ]),
    ]),
  ]),
]

export const enterAnimation = trigger('enterAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(400, style({ opacity: 1 })),
  ]),
])

export const itemMarginAnimation = trigger('itemMargin', [
  state(
    'open',
    style({
      margin: '20px 0',
    })
  ),
  state(
    '*',
    style({
      margin: '*',
    })
  ),
  transition('open => *', [
    query('@itemChildListAnimation', animateChild()),
    animate('200ms'),
  ]),
  transition('* => open', [
    query('@itemChildListAnimation', animateChild()),
    animate('200ms'),
  ]),
])
