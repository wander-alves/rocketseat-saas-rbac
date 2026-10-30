import { 
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  ForcedSubject,
  MongoAbility,
} from '@casl/ability';
import { User } from './models/user';
import { permissions } from './permissions';

const actions = ['manage', 'invite', 'delete'];
const subjects = ['User', 'all'];

type AppAbilities = [
  (typeof actions)[number],
  (
    | (typeof subjects)[number] 
    | ForcedSubject<Exclude<(typeof subjects)[number], 'all'>>
  ),
];

type AppAbility = MongoAbility<AppAbilities>;

const createAppAbilitiy = createMongoAbility as CreateAbility<AppAbility>


function defineAbilityFor(user: User) {
  if(typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found.`)
  }
  const builder = new AbilityBuilder(createAppAbilitiy);

  permissions[user.role](user, builder);
  const ability = builder.build();

  return ability;
}

export { defineAbilityFor };
export type { AppAbility };
