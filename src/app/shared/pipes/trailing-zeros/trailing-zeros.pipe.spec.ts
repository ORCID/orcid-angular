import { TrailingZerosPipe } from './trailing-zeros/trailing-zeros.pipe'

describe('TrailingZerosPipe', () => {
  it('create an instance', () => {
    const pipe = new TrailingZerosPipe()
    expect(pipe).toBeTruthy()
  })
})
