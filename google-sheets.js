const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON), // make sure this file exists
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function getSheetClient() {
  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client });
}

module.exports = getSheetClient;
