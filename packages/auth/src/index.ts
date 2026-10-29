import { 
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  ForcedSubject,
  MongoAbility,
} from '@casl/ability';

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

const { build, can, cannot } = new AbilityBuilder(createAppAbilitiy);

can('invite', 'User');
cannot('delete', 'User')

const ability = build();

export { ability };
export type { AppAbility };
