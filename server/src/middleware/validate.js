import AppError from '../utils/AppError.js';

const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    const message = result.error.errors
      .map((e) => (e.path.length ? `${e.path.join('.')}: ${e.message}` : e.message))
      .join('; ');
    return next(AppError.badRequest(message));
  }

  req[source] = result.data;
  next();
};

export default validate;