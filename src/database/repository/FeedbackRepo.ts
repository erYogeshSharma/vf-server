import { BadRequestError } from '../../core/ApiError';
import Feedback, { FeedbackModel } from '../model/CustomerFeedback';

async function create(feedback: Feedback): Promise<string> {
  try {
    await FeedbackModel.create(feedback);

    return 'Enquiry created';
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

export default {
  create,
};
