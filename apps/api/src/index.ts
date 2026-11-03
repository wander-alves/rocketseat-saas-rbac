import { defineAbilityFor, projectSchema } from '@rbac/auth';


const ability = defineAbilityFor({ role: 'MEMBER', id: 'user-01' });
const project = projectSchema.parse({ id: 'project-01', ownerId: 'user-01'});

console.log(ability.can('get', "Billing"));
console.log(ability.can('create', 'Invite'));
console.log(ability.can('delete', 'Project'));
console.log(ability.can('delete', project));