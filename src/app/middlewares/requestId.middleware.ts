import { randomUUID } from 'crypto';
import type { Request, Response, NextFunction } from 'express';

const requestIdMiddleware = (
  req: Request & { requestId?: string },
  res: Response,
  next: NextFunction,
) => {
  const requestId = randomUUID();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};

export { requestIdMiddleware };
