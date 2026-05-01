const express = require('express');
const bodyParser = require('body-parser');

const connectDB = require('./src/lib/db');
const authRouter = require('./src/routes/auth.router');

require('dotenv').config();

const app = express();

app.use(bodyParser.json()); 

app.get('/', (req, res) => {
  res.send('Welcome to Thinkify API!');
});
app.use('/api/auth', authRouter);

app.listen(process.env.PORT, () => {
  console.log('\n\n--------------------');
  console.log('⚡⚡ Server Running on PORT: ', process.env.PORT);
  console.log('--------------------');

  connectDB();
});