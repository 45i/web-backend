const express = require('express');
const app = express();
app.use(express.json());

// Webhook verification endpoint (for Instagram challenge verification)
app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === 'horseshit-haha') {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

// Webhook event listener (receives POST requests from Instagram)
app.post('/webhook', (req, res) => {
  console.log('Webhook received:', req.body);
  res.sendStatus(200); // Acknowledge receipt of the data
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
