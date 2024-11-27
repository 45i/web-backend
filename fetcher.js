const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://127.0.0.1:3000', // Specify the allowed origin
}));

app.get('/resolve-media/:postId', async (req, res) => {
  const postId = req.params.postId;
  let mediaUrl = `https://www.instagram.com/p/${postId}/media/?size=l`;

  console.log(`Attempting to fetch media URL: ${mediaUrl}`);
  try {
    let finalUrl = mediaUrl;
    let isRedirected = true;

    // Follow redirects manually
    while (isRedirected) {
      const response = await axios.get(finalUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        maxRedirects: 0, // Prevent axios from auto-following redirects
        validateStatus: (status) => status >= 200 && status < 400, // Consider 3xx status codes as valid
      });

      if (response.status >= 300 && response.status < 400 && response.headers.location) {
        console.log(`Redirected to: ${response.headers.location}`);
        finalUrl = response.headers.location;
      } else {
        isRedirected = false; // No further redirection
      }
    }

    console.log(`Final resolved URL: ${finalUrl}`);
    res.json({ finalUrl }); // Return the final resolved URL
  } catch (error) {
    console.error(`Error resolving media for postId ${postId}:`, error.message);
    res.status(500).json({ error: "Unable to resolve media" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
