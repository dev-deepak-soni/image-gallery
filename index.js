const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const dotEnv = require('dotenv');
dotEnv.config();
require('./config/config')
const PORT = process.env.PORT || 4000;
app.use(express.static('public')); 



const login = require('./routes/loginRoutes');
const upload = require('./routes/uploadRouter');
app.use('/',login)
app.use('/image',upload)


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })