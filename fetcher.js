const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'http://127.0.0.1:3000', // Specify the allowed origin
}));
app.use(express.json()); // Middleware to parse JSON bodies

app.post('/resolve-media', async (req, res) => {
  const { postId } = req.body; // Expecting { postId: 'DCoxW5oyyT7' } in request body
  const mediaUrl = `https://www.instagram.com/p/${postId}/media/?size=l`;

  console.log(`Attempting to fetch media URL: ${mediaUrl}`);
  try {
    const response = await axios.get(mediaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      maxRedirects: 0, // Prevent axios from auto-following redirects
      validateStatus: (status) => status >= 200 && status < 400, // Allow redirect status codes
    });

    if (response.status >= 300 && response.status < 400 && response.headers.location) {
      const resolvedUrl = response.headers.location; // Extract the redirected URL
      console.log(`Final resolved URL: ${resolvedUrl}`);
      res.json({ resolvedUrl }); // Send the resolved URL back
    } else {
      res.status(400).json({ error: 'Unexpected response format' });
    }
  } catch (error) {
    console.error(`Error resolving media for postId ${postId}:`, error.message);
    res.status(500).json({ error: 'Unable to resolve media' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
