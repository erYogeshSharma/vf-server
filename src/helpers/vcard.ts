import { BusinessDetails } from '@/data/bs';
import vcard from 'vcards-js';

export const createVCard = (business: BusinessDetails) => {
  const vCard = vcard();
  vCard.firstName = business.name.split(' ')[0];
  vCard.lastName = business.name.split(' ')[1];
  vCard.organization = business.name;
  vCard.title = business.title;
  vCard.email = business.email;
  vCard.workPhone = business.phone;
  vCard.workAddress.label = 'Office';
  vCard.photo.attachFromUrl(business.logo, 'image');
  vCard.url = `https://id.zapminds.com/${business.linkId}`;
  vCard.workAddress.street = business.address;
  vCard.workAddress.city = business.city;
  vCard.workAddress.stateProvince = business.state;
  vCard.workAddress.postalCode = business.zipCode;
  vCard.workAddress.countryRegion = business.country;
  return vCard.getFormattedString();
};

export const downloadVCard = (business: BusinessDetails) => {
  const vCard = createVCard(business);
  const blob = new Blob([vCard], { type: 'text/vcard' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${business.name}.vcf`;
  a.click();
  window.URL.revokeObjectURL(url);
};
