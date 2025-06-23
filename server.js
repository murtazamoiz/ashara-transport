const express = require('express');
const bodyParser = require('body-parser');
const getSheetClient = require('./google-sheets');

const app = express();
const port = process.env.PORT || 3000;

const SPREADSHEET_ID = '1X9xw0Pw4s2r2AUAhzjoaA4DKd4E3XtKL7hIpoKi6L0U'; // Replace with your actual ID

app.use(express.json());
app.use(bodyParser.json()); // Optional now, as express.json() is usually enough

app.get('/', (req, res) => {
  res.send('Hello from Backend');
});

app.post('/api/data', async (req, res) => {
  try {
    const sheets = await getSheetClient();
    const { values } = req.body;

    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Missing or invalid data format' });
    }

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'scan_data!A:D',
      valueInputOption: 'USER_ENTERED',
      resource: { values },
    });

    res.json({
      status: 'success',
      updatedRange: response.data.updates.updatedRange,
    });
  } catch (error) {
    console.error("Error writing to sheet:", error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
