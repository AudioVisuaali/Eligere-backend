const dotenv = require('dotenv');

// Set environment

const isProduction = process.env.NODE_ENV === 'production';
const environment = isProduction ? 'production' : 'default';

const { error } = dotenv.config({ path: `environment.${environment}.env` });
if (error) throw error;

// Start app
require('./app');
