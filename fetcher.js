const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
app.use(cors({
  origin: 'http://127.0.0.1:3000',  // Specify the allowed origin
}));
app.get('/resolve-media/:postId', async (req, res) => {
  const postId = req.params.postId;
  const mediaUrl = `https://instagram.com/p/${postId}/media/`;  // Corrected string interpolation

  console.log(`Attempting to fetch media URL: ${mediaUrl}`);  // Corrected string interpolation
  try {
    const response = await axios.get(mediaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    console.log(`Redirecting to media URL: ${response.headers.location}`);  // Corrected string interpolation
    res.redirect(response.request.res.responseUrl); 
  } catch (error) {
    console.error(`Error fetching media for postId ${postId}:`, error.response?.data || error.message);
    res.status(500).json({ error: "Unable to fetch media" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);  // Corrected string interpolation
});
