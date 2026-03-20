
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Add Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(process.env.PORT || 5000,() => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});