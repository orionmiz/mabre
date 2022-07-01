import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const targetURL = req.query.url as string;

  try {
    // trim 'http' or 'https' and concat again
    const target = await fetch(
      `http://${targetURL.replace(/^https?:\/\//, "")}`
    );

    const html = await target.text();

    const meta: {
      title?: string;
      description?: string;
      image?: {
        url: string;
      };
    } = {};

    // Get content of og:title
    const title = html.match(/<meta property="og:title" content="(.*?)"/);

    if (title) {
      meta.title = title[1];
    }

    // Get content of og:description
    const description = html.match(
      /<meta property="og:description" content="(.*?)"/
    );

    if (description) {
      meta.description = description[1];
    }

    // Get content of og:image
    const image = html.match(/<meta property="og:image" content="(.*?)"/);

    if (image) {
      meta.image = {
        url: image[1],
      };
    }

    // Get content of og:url
    const url = html.match(/<meta property="og:url" content="(.*?)"/);

    res.json({
      success: 1,
      link: url ? url[1] : targetURL,
      meta,
    });
  } catch {
    res.json({});
  }
}
