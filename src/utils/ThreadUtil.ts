import * as Joi from "joi";

export const addThread = Joi.object({
  content: Joi.string().required(),
  image: Joi.string().allow(""),
});

export const uploadMultipleImage = Joi.object({
  image: Joi.allow(""),
  images: Joi.allow(""),
  content: Joi.allow(""),
});

export const addThreadQueue = Joi.object({
  image: Joi.string().allow(""),
  images: Joi.allow(""),
  content: Joi.allow(""),
});
