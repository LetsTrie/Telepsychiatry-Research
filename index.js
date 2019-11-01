require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./config/server');
const config = require('./config/config');

mongoose.connect(
  config.mongodbHost,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  },
  () => console.log('connected to database!')
);

const port = config.port || 3000;
app.listen(port, () => console.log(`Server is running at port: ${port}`));
module.exports = app;
