import type { User } from 'firebase/auth';

export const ADMIN_EMAIL = 'taras.bratash@gmail.com';

export function isAuthorizedAdmin(user: Pick<User, 'email'> | null | undefined): boolean {
  return user?.email?.trim().toLowerCase() === ADMIN_EMAIL;
}
