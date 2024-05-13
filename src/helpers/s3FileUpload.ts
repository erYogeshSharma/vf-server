import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AWS } from '../config';

const s3 = new S3Client({
  region: AWS.mediaS3reqion,
  credentials: {
    accessKeyId: AWS.accessKey,
    secretAccessKey: AWS.secret,
  },
});

const BUCKET_NAME = AWS.mediaS3bucket;

export async function createPresignedPost({
  key,
  contentType,
}: {
  key: string;
  contentType: string;
}) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const fileLink = `${AWS.mediaCloudFrontURL}/${key}`;

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 5 * 60, // 5 minutes - default is 15 mins
  });

  return { fileLink, signedUrl };
}
