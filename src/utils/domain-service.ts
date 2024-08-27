import { DomainVerificationStatusProps } from 'domains';
import {
  addDomainToVercel,
  //   getApexDomain,
  getConfigResponse,
  getDomainResponse,
  //   getSubdomain,
  removeDomainFromVercelProject,
  validDomainRegex,
  verifyDomain,
} from './vercel-domains';

export async function verifyDomainStatus({
  params,
}: {
  params: { slug: string };
}) {
  const domain = decodeURIComponent(params.slug);
  let status: DomainVerificationStatusProps = 'Valid Configuration';

  const [domainJson, configJson] = await Promise.all([
    getDomainResponse(domain),
    getConfigResponse(domain),
  ]);

  if (domainJson?.error?.code === 'not_found') {
    // domain not found on Vercel project
    status = 'Domain Not Found';

    // unknown error
  } else if (domainJson.error) {
    status = 'Unknown Error';

    // if domain is not verified, we try to verify now
  } else if (!domainJson.verified) {
    status = 'Pending Verification';
    const verificationJson = await verifyDomain(domain);

    // domain was just verified
    if (verificationJson && verificationJson.verified) {
      status = 'Valid Configuration';
    }
  } else if (configJson.misconfigured) {
    status = 'Invalid Configuration';
  } else {
    status = 'Valid Configuration';
  }

  return {
    status,
    domainJson,
  };
}

type SelectSite = {
  //   id: string;
  //   name: string | null;
  //   image: string | null;
  subdomain: string | null;
  //   description: string | null;
  //   logo: string | null;
  //   font: string;
  //   imageBlurhash: string | null;
  customDomain: string | null;
  //   message404: string | null;
  //   createdAt: Date;
  //   updatedAt: Date;
  //   userId: string | null;
};
export async function addDomainToVercelProject(data: {
  domain: string;
  site: SelectSite;
}) {
  const key = 'customDomain';
  const value = data.domain;
  const site = data.site;
  try {
    let response;

    if (key === 'customDomain') {
      if (value.includes('vercel.pub')) {
        return {
          error: 'Cannot use vercel.pub subdomain as your custom domain',
        };

        // if the custom domain is valid, we need to add it to Vercel
      } else if (validDomainRegex.test(value)) {
        //TODO:Update the site in DB with the new custom domain

        response = await Promise.all([
          addDomainToVercel(value),
          // Optional: add www subdomain as well and redirect to apex domain
          addDomainToVercel(`www.${value}`),
        ]);
        // empty value means the user wants to remove the custom domain
      } else if (value === '') {
        //TODO: set custom domain to null in the site settings
      }

      // if the site had a different customDomain before, we need to remove it from Vercel
      if (site.customDomain && site.customDomain !== value) {
        response = await removeDomainFromVercelProject(site.customDomain);

        /* Optional: remove domain from Vercel team 

          // first, we need to check if the apex domain is being used by other sites
          const apexDomain = getApexDomain(`https://${site.customDomain}`);
          const domainCount = await db.select({ count: count() }).from(sites).where(or(eq(sites.customDomain, apexDomain), ilike(sites.customDomain, `%.${apexDomain}`))).then((res) => res[0].count);


          // if the apex domain is being used by other sites
          // we should only remove it from our Vercel project
          if (domainCount >= 1) {
            await removeDomainFromVercelProject(site.customDomain);
          } else {
            // this is the only site using this apex domain
            // so we can remove it entirely from our Vercel team
            await removeDomainFromVercelTeam(
              site.customDomain
            );
          }
          
          */
      }
    }

    console.log(
      'Updated site data! Revalidating tags: ',
      `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      `${site.customDomain}-metadata`,
    );

    //TODO Check whats happening here
    // revalidateTag(
    //   `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    // );
    // site.customDomain && revalidateTag(`${site.customDomain}-metadata`);

    return response;
  } catch (error: any) {
    if (error.code === 'P2002') {
      return {
        error: `This ${key} is already taken`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
}
