import User from '../../database/model/User';
import _ from 'lodash';

export const enum AccessMode {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
}

export async function getUserData(user: User) {
  const data = _.pick(user, [
    '_id',
    'name',
    'role',
    'profilePicUrl',
    'email',
    'business',
    'createdAt',
    'updatedAt',
    'role',
    'referralCode',
    'is_paid_plan',
    'plan_start_date',
    'plan_end_date',
  ]);
  return data;
}
