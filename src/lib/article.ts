import { NextApiResponse } from "next";
import { CDN } from "./constants";
import { uploadImage } from "./s3";
import { getFileHash } from "./util";

export const processImages = async (data: EditorJS.OutputData) => {
  const keys: string[] = [];

  await Promise.all(
    data.blocks.map(async (block) => {
      if (block.type === "image") {
        const dataURL: string = block.data.file.url;

        // external image
        const isExternal = dataURL.startsWith("http");
        if (isExternal) {
          return;
        }

        // parse data URL with regex
        const [, extension, base64] =
          dataURL.match(/data:image\/(.*?);base64,(.*)/) ?? [];

        if (!extension) throw new Error("Invalid image");

        const buffer = Buffer.from(base64, "base64");

        const name = getFileHash(buffer);

        await uploadImage(buffer, name);

        const Key = `images/${name}`;

        block.data.file.url = `${CDN}/${Key}`;

        keys.push(name);
      }
      return;
    })
  );

  return keys;
};

export const updateImages = async ({
  oldImages,
  update,
}: {
  oldImages: string[];
  update: EditorJS.OutputData;
}) => {
  let includeImage = false;

  const oldImageMap = oldImages.reduce((acc: Record<string, number>, cur) => {
    acc[cur] = 1; // 1: not in use, 2: re-use
    return acc;
  }, {});

  const newImages: Set<string> = new Set();

  // only connect.
  const linkedImages: Set<string> = new Set();

  await Promise.all(
    update.blocks.map(async (block) => {
      if (block.type === "image") {
        const dataURL: string = block.data.file.url;

        includeImage = true;

        // external image
        const isExternal = dataURL.startsWith("http");
        if (isExternal) {
          const keyMatcher = new RegExp(`^${CDN}/images/(.*)$`);

          const [, oldKey] = dataURL.match(keyMatcher) ?? [];

          if (oldKey) {
            if (oldImageMap[oldKey]) {
              // case 1: re-use old image
              oldImageMap[oldKey] = 2;
            } else {
              // case 2: re-use other article's image
              linkedImages.add(oldKey);
            }
          }
        } else {
          // parse data URL with regex
          const [, extension, base64] =
            dataURL.match(/data:image\/(.*?);base64,(.*)/) ?? [];

          if (!extension) throw new Error("Invalid image");

          const buffer = Buffer.from(base64, "base64");

          const name = getFileHash(buffer);

          const Key = `images/${name}`;

          if (oldImageMap[name]) {
            // case 3: use same image
            oldImageMap[name] = 2;
          } else if (!newImages.has(name)) {
            // case 4: new image
            newImages.add(name);
            await uploadImage(buffer, name);
          }

          block.data.file.url = `${CDN}/${Key}`;
        }
      }
      return;
    })
  );

  // delete images no longer in use
  const unusedImages = Object.keys(oldImageMap).filter(
    (key) => oldImageMap[key] === 1
  );

  return {
    newImages: [...newImages],
    unusedImages,
    linkedImages: [...linkedImages],
    includeImage,
  };
};

// CAUTION: middleware auth issue
export const revalidateArticle = async (
  res: NextApiResponse,
  boardId: string,
  articleId: number
) => {
  return Promise.all([
    res.revalidate(`/${boardId}/${articleId}`),
    res.revalidate(`/${boardId}/edit/${articleId}`),
  ]);
};
