import { ContributorRolesPipe } from './contributor-roles.pipe'

describe('ContributorRolesPipe', () => {
  let pipe: ContributorRolesPipe

  beforeEach(() => {
    pipe = new ContributorRolesPipe()
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return roles separated by comma if they exist', () => {
    expect(pipe.transform(getRoles())).toBe(
      'Conceptualization, Author, Editor'
    )
  })
});

function getRoles(): { role: string }[] {
  return [
    {role: 'conceptualization'},
    {role: 'author'},
    {role: 'editor'},
  ]
}
