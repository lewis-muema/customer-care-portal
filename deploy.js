const fs = require('fs');

const dotEnvContent = '';

const dotEnvPath = '.env';

fs.unlink(dotEnvPath, () => {
  /** Create the .env file */
  fs.appendFile('.env', dotEnvContent, error => {
    if (error) throw error;
  });
});
