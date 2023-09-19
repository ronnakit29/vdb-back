require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const port = process.env.PORT || 3323;

const app = express();


app.use(cors());
app.use(helmet())
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes'));

app.listen(port, () => {
	console.log(`Express server listening on port ${port}`);
	console.log(`Local   : http://localhost:${port}`);
	console.log(`Network : http://0.0.0.0:${port}`);
});