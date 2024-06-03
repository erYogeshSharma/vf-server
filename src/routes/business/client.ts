import express from 'express';
import {
  FailureMsgResponse,
  SuccessMsgResponse,
  SuccessResponse,
} from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import { PublicRequest } from 'app-request';
import BusinessRepo from '../../database/repository/BusinessRepo';
import schema from './schema';
import validator from '../../helpers/validator';
import { BadRequestError } from '../../core/ApiError';
import EnquiryRepo from '../../database/repository/EnquiryRepo';
import VisitsRepo from '../../database/repository/VisitsRepo';
import { Types } from 'mongoose';

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                         GET BUSINESS ID AVAILABILITY                        */
/* -------------------------------------------------------------------------- */
router.get(
  '/:id',
  asyncHandler(async (req: PublicRequest, res) => {
    const { id } = req.params;
    if (!id) {
      return new FailureMsgResponse('Id is required').send(res);
    }

    const business = await BusinessRepo.getBusinessByLinkId(id);

    if (!business) {
      return new FailureMsgResponse('Not found').send(res);
    }
    return new SuccessResponse('success', business).send(res);
  }),
);

/* -------------------------------------------------------------------------- */
/*                         CREATE A ENQUIRY                     */
/* -------------------------------------------------------------------------- */
router.post(
  '/:businessId',
  validator(schema.addEnquiry),
  asyncHandler(async (req: PublicRequest, res) => {
    const business = await BusinessRepo.getBusinessByLinkId(
      req.params.businessId,
    );

    if (!business) {
      throw new BadRequestError('Business not found');
    }

    const message = await EnquiryRepo.create({
      business: business._id,
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
      message: req.body.message,
    });

    //send mail to business owner

    new SuccessResponse('Enquiry created', message).send(res);
  }),
);

/* -------------------------------------------------------------------------- */
/*                        LOG VISIT                   */
/* -------------------------------------------------------------------------- */
router.post(
  '/log-visit/:businessId',
  validator(schema.logVisit),
  asyncHandler(async (req: PublicRequest, res) => {
    const business = await BusinessRepo.getBusinessById(
      new Types.ObjectId(req.params.businessId),
    );
    if (!business) {
      throw new BadRequestError('Business not found');
    }

    // function generateRandomIp() {
    //   return Array.from({ length: 4 }, () =>
    //     Math.floor(Math.random() * 256),
    //   ).join('.');
    // }

    // function generateRandomUserAgent() {
    //   const userAgents = [
    //     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    //     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    //     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    //     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    //     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    //   ];
    //   return userAgents[Math.floor(Math.random() * userAgents.length)];
    // }
    // function generateRandomDate(start: Date, end: Date) {
    //   return new Date(
    //     start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    //   );
    // }

    // const startDate = new Date('2024-01-01');
    // const endDate = new Date('2024-05-01');
    // const visits = [];
    // for (let i = 0; i < 300; i++) {
    //   const randomIp = generateRandomIp(); // Implement a function to generate a random IP address
    //   const randomUserAgent = generateRandomUserAgent(); // Implement a function to generate a random user agent
    //   const randomVisitedOn = generateRandomDate(startDate, endDate); // Implement a function to generate a random date between the start and end dates
    //   visits.push({
    //     business: business,
    //     ip: randomIp,
    //     userAgent: randomUserAgent,
    //     visitedOn: randomVisitedOn,
    //   });
    // }
    // await VisitsRepo.saveVisits(visits);

    await VisitsRepo.create({
      business: business._id as Types.ObjectId,
      ip: req.body.ip,
      userAgent: req.body.userAgent,
      visitedOn: new Date(),
    });

    new SuccessMsgResponse('Visit Logged').send(res);
  }),
);

export default router;
