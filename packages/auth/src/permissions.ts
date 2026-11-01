import { AbilityBuilder } from '@casl/ability';

import { AppAbility } from './index';
import type { User } from './models/user';
import type { Role } from './roles';

type PermissionsByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void;

const permissions: Record<Role,PermissionsByRole> = {
  ADMIN: (_, { can })=> {
    can('manage', 'all');
  },
  MEMBER: (_, { can })=> {
    can('manage', 'Project');
  },
  BILLING() {},
}

export { permissions };
