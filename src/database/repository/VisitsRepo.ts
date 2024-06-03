import { BadRequestError } from '../../core/ApiError';
import Visitor, { VisitorModel } from '../model/Visitor';
import moment from 'moment';

//SAVE A VISIT TO THE DATABASE
async function create(visit: Visitor): Promise<string> {
  try {
    await VisitorModel.create(visit);
    return 'Visit created successfully';
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

async function saveVisits(visits: Visitor[]): Promise<string> {
  try {
    await VisitorModel.insertMany(visits);
    return 'Visits saved successfully';
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

async function getVisitsWithFilters(
  businessId: string,
  startDate?: string,
  endDate?: string,
): Promise<Visitor[]> {
  // If startDate and endDate are not provided, get data for the last one week

  try {
    const query: any = { business: businessId };
    // Ensure that startDate and endDate are valid Date objects
    if (startDate && endDate) {
      query.visitedOn = {
        $gte: moment(startDate),
        $lte: moment(endDate),
      };
    }

    const visitors = await VisitorModel.find(query).sort({ visitedOn: 1 });
    return visitors;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

export default {
  create,
  saveVisits,
  getVisitsWithFilters,
};
