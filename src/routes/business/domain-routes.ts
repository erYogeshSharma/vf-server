import { ProtectedRequest } from 'app-request';
import express from 'express';
import authentication from '../../auth/authentication';
import asyncHandler from '../../helpers/asyncHandler';
import { FailureMsgResponse } from '../../core/ApiResponse';
import {
  addDomainToVercelProject,
  verifyDomainStatus,
} from '../../utils/domain-service';

const router = express.Router();

router.use(authentication);

router.post(
  '/',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const domain = req.body?.domain;
    console.log(req.body.business);

    if (!domain) {
      throw new FailureMsgResponse('Domain is required');
    }

    const siteData = await addDomainToVercelProject({
      domain: 'site.yogeshh.me',
      site: {
        customDomain: 'site.yogeshh.me',
        subdomain: 'yogeshh',
      },
    });

    res.send(siteData);
  }),
);

//get domain status
router.get(
  '/',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const siteData = await verifyDomainStatus({
      params: { slug: 'site.yogeshh.me' },
    });

    res.send(siteData);
  }),
);

export default router;
