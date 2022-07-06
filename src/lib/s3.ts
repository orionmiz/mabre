import AWS from "aws-sdk";

const REGION = process.env.S3_REGION as string;
const BUCKET = process.env.S3_BUCKET as string;
const ACCESS_KEY = process.env.S3_ACCESS_KEY as string;
const SECRET_KEY = process.env.S3_SECRET_KEY as string;

AWS.config.update({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

const client = new AWS.S3();

export const uploadFile = async (Body: Buffer, Key: string) => {
  const upload = client.putObject({
    Bucket: BUCKET,
    Key,
    Body,
  });

  return upload.promise();
};

export const uploadImage = async (body: Buffer, name: string) => {
  return uploadFile(body, `images/${name}`);
};

export const deleteFiles = async (Keys: string[]) => {
  const remove = client.deleteObjects({
    Bucket: BUCKET,
    Delete: {
      Objects: Keys.map((Key) => ({ Key })),
    },
  });

  return remove.promise();
};

export const deleteImageObjects = async (keys: string[]) => {
  return deleteFiles(keys.map((key) => `images/${key}`));
};
