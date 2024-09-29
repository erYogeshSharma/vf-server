import { ProtectedRequest } from 'app-request';
import express from 'express';
import authentication from '../../auth/authentication';
import asyncHandler from '../../helpers/asyncHandler';
import {
  BadRequestResponse,
  FailureMsgResponse,
  SuccessMsgResponse,
} from '../../core/ApiResponse';
import {
  addDomainToVercelProject,
  verifyDomainStatus,
} from '../../utils/domain-service';
import BusinessRepo from '../../database/repository/BusinessRepo';
import { removeDomainFromVercelProject } from '../../utils/vercel-domains';

const router = express.Router();

router.use(authentication);

router.post(
  '/',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const domain = req.body?.domain;
    /**
     *
     * find the user's business
     * assign the domain to the business
     * update the business
     *
     * */

    if (!domain) {
      throw new FailureMsgResponse('Domain is required');
    }

    const business = await BusinessRepo.getAllUserBusiness(req.user._id);

    if (!business.length) {
      throw new BadRequestResponse('Business not found');
    }

    if (business[0].customDomain === domain) {
      throw new BadRequestResponse('Domain already in use');
    }

    const siteData = await addDomainToVercelProject(
      business[0].customDomain,
      domain,
    );

    if (siteData.error) {
      throw new BadRequestResponse(siteData.error);
    }

    if (business[0]._id) {
      await BusinessRepo.updateCustomDomain(
        business[0]._id.toString(),
        siteData.name,
      );
    }

    res.send(siteData);
  }),
);

//get domain status
router.get(
  '/',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const business = await BusinessRepo.getAllUserBusiness(req.user._id);

    if (!business.length) {
      throw new BadRequestResponse('Business not found');
    }

    if (!business[0].customDomain) {
      throw new BadRequestResponse('Domain not found');
    }

    const siteData = await verifyDomainStatus({
      params: { slug: business[0].customDomain },
    });

    res.send(siteData);
  }),
);

router.delete(
  '/',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const business = await BusinessRepo.getAllUserBusiness(req.user._id);

    if (!business.length) {
      throw new BadRequestResponse('No Business for this user');
    }

    if (!business[0].customDomain) {
      throw new BadRequestResponse('No Custom Domain found');
    }

    const response = await removeDomainFromVercelProject(
      business[0].customDomain,
    );

    if (response.error) {
      throw new BadRequestResponse(response.error);
    }
    if (business[0]._id) {
      await BusinessRepo.updateCustomDomain(business[0]._id.toString(), '');
    }
    new SuccessMsgResponse('Domain Removed Successfully!').send(res);
  }),
);

export default router;
