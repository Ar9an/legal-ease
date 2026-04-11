import Joi from 'joi';

export const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  req.body = value;
  next();
};

export const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  req.body = value;
  next();
};

export const validateDocument = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(200).required(),
    content: Joi.string().min(1).required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  req.body = value;
  next();
};
