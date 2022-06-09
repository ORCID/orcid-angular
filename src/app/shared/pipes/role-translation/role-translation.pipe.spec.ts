import { RoleTranslationPipe } from './role-translation.pipe'
import { ContributionRoles, Role } from '../../../types/works.endpoint'

describe('RoleTranslationPipe', () => {
  let pipe: RoleTranslationPipe
  let roles: Role[]

  beforeEach(() => {
    pipe = new RoleTranslationPipe()
    roles = ContributionRoles
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return translation of the role by key', () => {
    expect(pipe.transform('writing – review & editing', roles)).toBe('Writing - review & editing');
  });
});
