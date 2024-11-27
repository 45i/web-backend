const express = require('express');
const axios = require('axios');
const app = express();

app.get('/resolve-media/:postId', async (req, res) => {
  const postId = req.params.postId;
  const mediaUrl = `https://www.instagram.com/p/${postId}/media/?size=l`;

  console.log(`Attempting to fetch media URL: ${mediaUrl}`);
  try {
    const response = await axios.get(mediaUrl, { maxRedirects: 0 });
    console.log(`Redirecting to media URL: ${response.headers.location}`);
    res.redirect(response.headers.location);
  } catch (error) {
    console.error(`Error fetching media for postId ${postId}:`, error.response?.data || error.message);
    res.status(500).json({ error: "Unable to fetch media" });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
