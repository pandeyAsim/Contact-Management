import slugify from "slugify";
import { nanoid } from "nanoid";
import env from "../config/env.config";
import { Model, ModelCtor } from "sequelize-typescript";
import { Op } from "sequelize";

export const slugifyString = (str: string): string => {
  return slugify(str, {
    remove: /[*+~.()'"!:@]/g,
    replacement: "-",
    lower: true,
    trim: true,
  });
};

export const generateSlug = (len: number): string => {
  return nanoid(len);
};
export const generateUniqueSlug = async ({
  model,
  text,
  id,
}: {
  model: ModelCtor<Model>;
  text: string;
  id?: string;
}): Promise<string> => {
  // if text is too long, truncate it
  if (text.length > 80) {
    text = text.slice(0, 80);
  }

  const slug = slugifyString(text);

  const existing = await model.findOne({
    where: {
      slug,
      ...(id && {
        id: {
          [Op.ne]: id,
        },
      }),
    },
  });

  if (!existing) {
    return slug;
  }

  const newSlug = `${slug}-${generateSlug(6)}`;

  // check slug length if it is not empty
  if (newSlug.length < 6) {
    return generateSlug(6);
  }

  return newSlug;
};

export const getQualifiedImageUrl = (
  relativePath?: string | null,
  useDefault: boolean = true
): string => {
  console.log('getQualifiedImageUrl called with:', { relativePath, useDefault, APP_URL: env.APP_URL });
  
  // If no path provided and default is requested, return default avatar
  if ((!relativePath || relativePath === null) && useDefault) {
    const defaultUrl = `${env.APP_URL}/uploads/default/avatar-modern.svg`;
    console.log('Returning default avatar URL:', defaultUrl);
    return defaultUrl;
  }
  
  // If no path and no default requested, return empty string
  if (!relativePath || relativePath === null) {
    console.log('No path and no default requested, returning empty string');
    return "";
  }
  
  // Normalize the path: replace backslashes with forward slashes
  let normalizedPath = relativePath.replace(/\\/g, '/');
  
  // If the path doesn't start with 'uploads/', add it
  if (!normalizedPath.startsWith('uploads/')) {
    normalizedPath = `uploads/${normalizedPath}`;
  }
  
  // Remove any double slashes
  normalizedPath = normalizedPath.replace(/\/+/g, '/');
  
  const fullUrl = `${env.APP_URL}/${normalizedPath}`;
  console.log('Returning full URL:', fullUrl);
  return fullUrl;
};
