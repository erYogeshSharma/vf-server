import User, { UserModel } from '../model/User';
import { Types } from 'mongoose';
import KeystoreRepo from './KeystoreRepo';
import Keystore from '../model/Keystore';
import { BadRequestError } from '../../core/ApiError';

async function exists(id: Types.ObjectId): Promise<boolean> {
  const user = await UserModel.exists({ _id: id, status: true });
  return user !== null && user !== undefined;
}

function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
// contains critical information of the user
async function findById(id: Types.ObjectId): Promise<User | null> {
  return UserModel.findOne({ _id: id, status: true })
    .select('+email +password +role +resetPasswordToken +business +role')
    .populate({
      path: 'role',
      match: { status: true },
    })
    .lean()
    .exec();
}

async function findByEmail(email: string): Promise<User | null> {
  try {
    const user = await UserModel.findOne({ email: email })
      .select('+email +password +role +name +profilePicUrl +referralCode')
      .lean()
      .exec();
    if (user?.email && !user?.referralCode) {
      user.referralCode =
        user?.name?.replace(' ', '')?.toUpperCase() + generateReferralCode();
      await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
        .lean()
        .exec();
    }
    return user;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
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
  referralCode: string,
): Promise<{ user: User; keystore: Keystore }> {
  // check if the user has a referral code
  let referredBy: Types.ObjectId | null = null;
  if (referralCode) {
    const referrer = await UserModel.findOne({ referralCode: referralCode });
    referredBy = referrer ? referrer._id : null;
  }

  const createdUser = await UserModel.create({
    name: user.name,
    email: user.email?.toLowerCase(),
    profilePicUrl: user.profilePicUrl,
    password: user.password,
    referralCode:
      user.name?.replace(' ', '')?.toUpperCase() + generateReferralCode(),
    referredBy: referredBy ? referredBy : null,
    role: 'USER',
    is_paid_plan: 'ACTIVE',
    plan_start_date: new Date(),
    plan_end_date: new Date(new Date().setDate(new Date().getDate() + 7)), // Add 7 days to the current date
  });
  const keystore = await KeystoreRepo.create(
    createdUser,
    accessTokenKey,
    refreshTokenKey,
  );

  return {
    user: { ...createdUser.toObject(), role: 'USER' },
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

async function getAllUsers(): Promise<User[]> {
  try {
    const users = await UserModel.find({ status: true })
      .select(
        'createdAt updatedAt name email phone status profilePicUrl business is_paid_plan plan_start_date plan_end_date',
      )
      .populate('business', 'name linkId')
      .lean()
      .exec();

    for (const user of users) {
      if (!user.plan_end_date) {
        user.plan_start_date = user.createdAt;
        user.plan_end_date = new Date(
          new Date().setDate(new Date().getDate() + 7),
        );
        user.is_paid_plan = 'ACTIVE';
      }
      await UserModel.updateOne({ _id: user._id }, { $set: { ...user } });
    }

    return users;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}
async function updateUserPlan(user: Partial<User>): Promise<User> {
  if (!user._id) {
    throw new BadRequestError('User ID is required');
  }
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(user._id, {
      plan_end_date: user.plan_end_date,
      is_paid_plan: user.is_paid_plan,
    })
      .select(
        'createdAt updatedAt name email phone status profilePicUrl business is_paid_plan plan_start_date plan_end_date',
      )
      .populate('business', 'name linkId')
      .lean()
      .exec();
    if (!updatedUser) {
      throw new BadRequestError('User not found');
    }
    return updatedUser;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

async function getReferrals(id: Types.ObjectId): Promise<User[]> {
  try {
    const users = await UserModel.find({ referredBy: id })
      .select(
        'createdAt updatedAt name email phone status profilePicUrl business is_paid_plan plan_start_date plan_end_date',
      )
      .populate('business', 'name linkId')
      .lean()
      .exec();
    return users;
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
  getAllUsers,
  getReferrals,
  updateUserPlan,
};
