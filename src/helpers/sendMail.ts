import sendgrid from '@sendgrid/mail';
import logger from '../core/Logger';

import { sg } from '../config';

async function sendmail(msg: any) {
  sendgrid.setApiKey(sg.apiKey);

  if (msg.bcc) {
    if (Array.isArray(msg.to)) {
      if (
        msg.to.find(
          (str: string) => str.toLowerCase() === msg.bcc.toLowerCase(),
        )
      )
        msg.bcc = undefined;
    } else {
      if (msg.to.toLowerCase() == msg.bcc.toLowerCase()) msg.bcc = undefined;
    }
  }

  await sendgrid
    .send(msg)
    .then((response) => {
      logger.info(`Email sent - Code: ${response[0].statusCode}`);
    })
    .catch((error) => {
      logger.error(`Email send failed: ${error}`);
    });
}

export default sendmail;
