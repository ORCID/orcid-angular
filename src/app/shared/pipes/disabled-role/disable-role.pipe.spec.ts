import { DisableRolePipe } from './disable-role.pipe'
import { FormBuilder } from '@angular/forms'

describe('DisableRolePipe', () => {
  let pipe: DisableRolePipe

  beforeEach(() => {
    pipe = new DisableRolePipe()
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy()
  })

  it('should return true if value is present and disabled in form', () => {
    const formBuilder = new FormBuilder()
    const rolesFormArray = formBuilder.array([
      formBuilder.group({
        role: [{ value: 'conceptualization', disabled: true }],
      }),
      formBuilder.group({
        role: ['unspecified'],
      }),
    ])

    expect(
      pipe.transform('conceptualization', rolesFormArray.controls[0])
    ).toBe(true)
    expect(pipe.transform('unspecified', rolesFormArray.controls[1])).toBe(
      false
    )
  })
})
