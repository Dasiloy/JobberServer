import { Request, Response, NextFunction } from 'express';

export function redirectMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.path === '/' || req.path === '/api' || req.path === '/api/v1') {
    return res.redirect(302, '/api/docs');
  }
  next();
}
