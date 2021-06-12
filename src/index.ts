import express from 'express';
import dotenv from 'dotenv';

// initialize configuration
dotenv.config();

const app = express();
const port = process.env.APP_PORT; // default port to listen

// define a route handler for the default home page
app.get('/', (req, res) => {
  res.send('ok111');
});

// start the Express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
