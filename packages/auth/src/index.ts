import { 
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability';
import { z } from 'zod';

import { User } from './models/user';
import { permissions } from './permissions';
import { userSubjectSchema } from './subjects/user';
import { organizationSubjectSchema } from './subjects/organization';
import { projectSubjectSchema } from './subjects/project';
import { inviteSubjectSchema } from './subjects/invite';
import { billingSubjectSchema } from './subjects/billing';

const appAbilitiesSchema = z.union([
  projectSubjectSchema,
  userSubjectSchema,
  organizationSubjectSchema,
  inviteSubjectSchema,
  billingSubjectSchema,
  z.tuple([z.literal('manage'), z.literal('all')]),
]);

type AppAbilities = z.infer<typeof appAbilitiesSchema>;

type AppAbility = MongoAbility<AppAbilities>;

const createAppAbilitiy = createMongoAbility as CreateAbility<AppAbility>


function defineAbilityFor(user: User) {
  if(typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found.`);
  }

  const builder = new AbilityBuilder(createAppAbilitiy);

  permissions[user.role](user, builder);
  const ability = builder.build();

  return ability;
}

export { defineAbilityFor };
export type { AppAbility };
