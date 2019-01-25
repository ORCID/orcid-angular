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
        'max-width': '0',
        opacity: '0',
        overflow: 'hidden',
      })
    ),
    state(
      'open',
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
    transition(
      '* => open',
      [style({ height: '{{initialHeight}}' }), animate(250)],
      {
        params: { initialHeight: '0px' },
      }
    ),
    transition(
      'open => *',
      [style({ opacity: '0.37', 'max-width': '{{finalWidth}}' }), animate(250)],
      {
        params: { finalWidth: '*' },
      }
    ),
  ]),
]

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
    transition(
      '* => open',
      [style({ height: '{{initialHeight}}' }), animate(250)],
      {
        params: { initialHeight: '0px' },
      }
    ),
    transition(
      'open => *',
      [style({ opacity: '0.37', 'max-width': '{{finalWidth}}' }), animate(250)],
      {
        params: { finalWidth: '*' },
      }
    ),
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
      stagger(20, [animate('0.2s', style({ opacity: 1 }))]),
    ]),
  ]),
])

export const nestedListAnimation = [
  trigger('itemChildListAnimation', [
    transition(':leave', [
      style({ opacity: 40 }),
      animate(100, style({ opacity: 0 })),
    ]),
  ]),
  trigger('childListAnimation', [
    // First load
    transition('void => *', [
      query(
        ':enter',
        [
          style({ opacity: 0 }),
          stagger(50, [animate('0.5s', style({ opacity: 1 }))]),
        ],
        { optional: true }
      ),
    ]),

    // Afther the list is reordered
    transition('* => *', [
      query('@itemChildListAnimation', [
        style({ opacity: 0 }),
        stagger(100, [animate('0.5s', style({ opacity: 1 }))]),
      ]),
    ]),
  ]),
  trigger('parentListAnimation', [
    transition('*=>*', [
      query(':enter', [
        style({ opacity: 0 }),
        stagger(200, [animate('0.2s', style({ opacity: 1 }))]),
        query('@childListAnimation', animateChild()),
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
