import { Types } from 'mongoose';
import Link, { LinkModel } from '../model/Link';

async function create(link: Link): Promise<Link> {
  const now = new Date();
  link.createdAt = link.updatedAt = now;
  const createdLink = await LinkModel.create(link);
  return createdLink;
}

async function find(user: Types.ObjectId): Promise<Link[]> {
  const links = await LinkModel.find({
    $or: [
      {
        $and: [{ isActive: true }, { isMaster: true }],
      },
      {
        createdBy: user,
      },
    ],
  })
    .lean()
    .exec();
  return links;
}

export default {
  create,
  find,
};
