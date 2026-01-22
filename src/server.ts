import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import cookieParser from 'cookie-parser'
dotenv.config();

const app = express();
const port = process.env.PORT || 8123;

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use()

let Server;
const start_server = () => {
  return new Promise((resolve, reject) => {
    try {
      app.listen(port, () => {
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
    });
  }
};

process.on('SIGINT', turningoffServer);
process.on('SIGTERM', turningoffServer);

start_server();
