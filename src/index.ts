import express from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import path from 'path';

import indexRouter from './routes/index';
import winston from './config/winston';

// initialize configuration
dotenv.config();

const app = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/abc', indexRouter);
// define a route handler for the default home page
app.get('/', (req, res) => {
  res.send('Running nodejs with docker!');
});

// // catch 404 and forward to error handler
app.use((req, res, next) => {
  next('dddd');
  // next(createError(404));
});

// error handler
app.use((param, req, res, next) => {
  winston.error(param);

  // set locals, only providing error in development
  res.locals.message = 'abc';
  res.locals.error = req.app.get('env') === 'development' ? 'err' : {};

  // render the error page
  res.status(404);
  res.send({ message: 'sai cmnr' });
});

const port = process.env.APP_PORT; // default port to listen
// start the Express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
