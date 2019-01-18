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

export const rotateAnimation = trigger('rotatedState', [
  state('close', style({ transform: 'rotate(0)' })),
  state('open', style({ transform: 'rotate(180deg)' })),
  transition('open => close', animate('200ms ease-out')),
  transition('close => open', animate('200ms ease-in')),
])

export const heightAnimation = [
  trigger('heightAnimationState', [
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
      'close => open',
      [style({ height: '{{initialHeight}}' }), animate(250)],
      {
        params: { initialHeight: '0px' },
      }
    ),
    transition(
      'open => close',
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
      'close',
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
  trigger('childListAnimation', [
    transition('* => *', [
      query(':enter', [
        style({ opacity: 0 }),
        stagger(100, [animate('0.2s', style({ opacity: 1 }))]),
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
