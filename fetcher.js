const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors()); // Allow cross-origin requests

app.get('/resolve-media/:postId', async (req, res) => {
  const postId = req.params.postId;
  const mediaUrl = `https://www.instagram.com/p/${postId}/media/?size=l`;

  try {
    // Fetch the media URL using Axios
    const response = await axios.get(mediaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      maxRedirects: 5, // Follow redirects
    });

    // Return the final resolved media URL
    res.json({ mediaUrl: response.request.res.responseUrl });
  } catch (error) {
    console.error(`Error fetching media for postId ${postId}:`, error.message);
    res.status(500).json({ error: "Unable to fetch media" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
