import { AbilityBuilder } from '@casl/ability';

import { AppAbility } from './index';
import { type User } from './models/user';

type Role = 'ADMIN' | 'MEMBER';

type PermissionsByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void;

const permissions: Record<Role,PermissionsByRole> = {
  ADMIN: (_, { can })=> {
    can('manage', 'all');
  },
  MEMBER: (_, { can })=> {
    can('invite', 'User');
    can('manage', 'Project');
  }
}

export { permissions };