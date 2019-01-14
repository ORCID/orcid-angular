import { trigger } from '@angular/animations'
import { state } from '@angular/animations'
import { transition } from '@angular/animations'
import { style } from '@angular/animations'
import { animate } from '@angular/animations'

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
    transition('open => close', [style({ opacity: '0.37' }), animate(250)]),
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
