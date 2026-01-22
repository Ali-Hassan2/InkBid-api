import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import hpp from 'hpp';
import { randomUUID } from 'crypto';
import colors from 'colors';
import rateLimit from 'express-rate-limit';
import { requestIdMiddleware } from './app/middlewares/requestId.middleware.js';
import { rateLimitErrorMessage } from './constants/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8123;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(requestIdMiddleware);
app.use(helmet());
app.use(hpp());
app.use(cookieParser());
app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(compression());
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Cookie', 'Authorization'],
  }),
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 100 : 1000,
    message: rateLimitErrorMessage,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

let Server: any;
const start_server = () => {
  return new Promise((resolve, reject) => {
    try {
      Server = app.listen(port, () => {
        console.log(colors.bgGreen(`Server is running at port: ${port}`));
      });
      resolve(Server);
    } catch (error: unknown) {
      let errorMessage = 'server facing error';
      if (typeof error === 'string') {
        errorMessage = 'Error while starting the server';
        console.log(colors.bgRed(errorMessage));
      }
      reject(error);
      process.exit(1);
    }
  });
};

const turningoffServer = async () => {
  console.log(colors.bgGreen('Gracefully shutting down the server....'));
  if (Server) {
    Server.close(() => {
      console.log(colors.bgRed('Server Closed.'));
      process.exit(0);
    });
  }
};

process.on('SIGINT', turningoffServer);
process.on('SIGTERM', turningoffServer);

start_server();
