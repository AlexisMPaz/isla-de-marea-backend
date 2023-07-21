import './config/dotenv/dotenv.js';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import multer from 'multer';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { __dirname } from './path.js';
import router from './routes/index.routes.js';
import passport from 'passport';
import { initializePassport } from './config/passport/passport.js';
import cors from 'cors';
import { Server } from "socket.io";
import errorHandler from './config/middlewares/errorHandler.js';
import { addLogger } from './utils/logger/logger.js';

const PORT = process.env.PORT || 8080;
const app = express();

// Configuración de CORS
const whiteList = ["http://localhost:3000", "http://localhost:8080", "https://app-isla-de-marea.onrender.com"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentación de la aplicación Isla-de-Marea',
      description: 'Documentacion de los endpoints de Carts y Products.',
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);

app.use(cors(corsOptions));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(addLogger);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://app-isla-de-marea.onrender.com');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

const connectionMongoose = async () => {
  try {
    await mongoose.connect(process.env.URLMONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Failed to connect to MongoDB:', error);
  }
};

connectionMongoose();

app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use('/', router);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});