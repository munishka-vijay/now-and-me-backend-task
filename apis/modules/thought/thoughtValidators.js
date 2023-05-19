const Joi = require("joi");

exports.validateThought = async (req) => {
  // Create schema for request validatation
  const schema = Joi.object({
    text: Joi.string().required(),
    isAnonymous: Joi.bool().required(),
  });

  // Validate request body with Joi
  const validated = schema.validate(req.body);

  return validated;
};

exports.validateQuery = async (req) => {
  // Creating schema for request validation
  const schema = Joi.object({
    limit: Joi.number().min(1).max(20).optional(),
    offset: Joi.number().min(0).optional(),
  });

  // Validating request body with Joi
  const validated = schema.validate(req.query);

  return validated;
};


exports.validateUserId = async (req) => {
  // Creating schema for request validatation
  const schema = Joi.object({
    userId: Joi.string().hex().length(24).required(),
  });

  // Validate request body with Joi
  const validated = schema.validate(req.params);

  return validated;
};

exports.validateThoughtId = async (req) => {
  // Creating schema for request validatation
  const schema = Joi.object({
    thoughtId: Joi.string().hex().length(24).required(),
  });

  // Validate request body with Joi
  const validated = schema.validate(req.params);

  return validated;
};