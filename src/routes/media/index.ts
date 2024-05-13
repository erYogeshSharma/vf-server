import express, { Response } from 'express';
import { createPresignedPost } from '../../helpers/s3FileUpload';
import authentication from '../../auth/authentication';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import { RoleRequest } from 'app-request';
import { FailureMsgResponse, SuccessResponse } from '../../core/ApiResponse';

const router = express.Router();

router.use(authentication);
router.post(
  '/signed-url',
  validator(schema.fileData),
  asyncHandler(async (req: RoleRequest, res: Response) => {
    try {
      // eslint-disable-next-line prefer-const
      let { key, content_type } = req.body;
      key = 'public/' + key;
      const data = await createPresignedPost({
        key,
        contentType: content_type,
      });

      new SuccessResponse('Successful', {
        ...data,
      }).send(res);
    } catch (err) {
      console.error(err);
      new FailureMsgResponse('Error while signing URL').send(res);
    }
  }),
);

export default router;
