const https = require('https');

/**
 * This script pings the backend server every 14 minutes to prevent 
 * Render's free tier from putting the service to sleep.
 * 
 * To use this, call it in your server.js or set up an external cron job.
 */
const keepAlive = (url) => {
  if (!url) {
    console.log('No BACKEND_URL provided for keep-alive. Skipping...');
    return;
  }

  console.log(`Keep-alive interval started for: ${url}`);
  
  // Ping every 14 minutes (Render sleeps after 15 mins of inactivity)
  setInterval(() => {
    https.get(url, (res) => {
      console.log(`Keep-alive ping sent to ${url}. Status Code: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`Keep-alive ping failed for ${url}:`, err.message);
    });
  }, 14 * 60 * 1000); 
};

module.exports = keepAlive;
