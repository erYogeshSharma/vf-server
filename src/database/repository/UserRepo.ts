import User, { UserModel } from '../model/User';
import { RoleModel } from '../model/Role';
import { Types } from 'mongoose';
import KeystoreRepo from './KeystoreRepo';
import Keystore from '../model/Keystore';
import { BadRequestError } from '../../core/ApiError';

async function exists(id: Types.ObjectId): Promise<boolean> {
  const user = await UserModel.exists({ _id: id, status: true });
  return user !== null && user !== undefined;
}

// contains critical information of the user
async function findById(id: Types.ObjectId): Promise<User | null> {
  return UserModel.findOne({ _id: id, status: true })
    .select('+email +password +roles +resetPasswordToken +business')
    .populate({
      path: 'roles',
      match: { status: true },
    })
    .lean()
    .exec();
}

async function findByEmail(email: string): Promise<User | null> {
  return UserModel.findOne({ email: email })
    .select(
      '+email +password +roles +gender +dob +grade +country +state +city +school +bio +hobbies',
    )
    .populate({
      path: 'roles',
      match: { status: true },
      select: { code: 1 },
    })
    .lean()
    .exec();
}

async function findFieldsById(
  id: Types.ObjectId,
  ...fields: string[]
): Promise<User | null> {
  return UserModel.findOne({ _id: id, status: true }, [...fields])
    .lean()
    .exec();
}

async function findPublicProfileById(id: Types.ObjectId): Promise<User | null> {
  return UserModel.findOne({ _id: id, status: true }).lean().exec();
}

async function create(
  user: User,
  accessTokenKey: string,
  refreshTokenKey: string,
  roleCode: string,
): Promise<{ user: User; keystore: Keystore }> {
  const now = new Date();

  const role = await RoleModel.findOne({ code: roleCode })
    .select('+code')
    .lean()
    .exec();
  // if (!role) throw new InternalError('Role must be defined');
  if (!role) {
    const r = await RoleModel.create({
      code: roleCode,
      status: true,
      createdAt: now,
      updatedAt: now,
    });

    user.roles = [r];
  }

  user.createdAt = user.updatedAt = now;
  const createdUser = await UserModel.create(user);
  const keystore = await KeystoreRepo.create(
    createdUser,
    accessTokenKey,
    refreshTokenKey,
  );
  return {
    user: { ...createdUser.toObject(), roles: user.roles },
    keystore: keystore,
  };
}

async function update(
  user: User,
  accessTokenKey: string,
  refreshTokenKey: string,
): Promise<{ user: User; keystore: Keystore }> {
  user.updatedAt = new Date();
  await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
    .lean()
    .exec();
  const keystore = await KeystoreRepo.create(
    user,
    accessTokenKey,
    refreshTokenKey,
  );
  return { user: user, keystore: keystore };
}

async function updateInfo(user: Partial<User>): Promise<any> {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: user._id },
      { $set: { ...user } },
      { new: true },
    )
      .lean()
      .exec();
    return updatedUser;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

export default {
  exists,
  findById,
  findByEmail,
  findFieldsById,
  findPublicProfileById,
  create,
  update,
  updateInfo,
};
