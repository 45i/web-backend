const express = require('express');
const axios = require('axios');
const app = express();

app.get('/resolve-media/:postId', async (req, res) => {
  const postId = req.params.postId;
  const mediaUrl = `https://www.instagram.com/p/${postId}/media/?size=l`;

  console.log(`Attempting to fetch media URL: ${mediaUrl}`);
  try {
    // First request to get the redirect URL
    const response = await axios.get(mediaUrl, {
      maxRedirects: 0, // Prevent automatic redirects
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    // Extract the redirected URL from the headers
    const imageUrl = response.headers.location;

    if (!imageUrl) {
      throw new Error('Redirect URL not found in headers.');
    }

    console.log(`Fetching image from resolved URL: ${imageUrl}`);

    // Second request to fetch the actual image
    const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });

    // Set the appropriate content-type header and pipe the image data to the client
    res.setHeader('Content-Type', imageResponse.headers['content-type']);
    imageResponse.data.pipe(res);
  } catch (error) {
    console.error(`Error fetching media for postId ${postId}:`, error.response?.data || error.message);
    res.status(500).json({ error: "Unable to fetch media" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
