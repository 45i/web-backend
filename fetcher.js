async function resolveAndSetImage(postId) {
  try {
    const response = await fetch('http://127.0.0.1:4000/resolve-media', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId }), // Sending postId in the body
    });

    if (response.ok) {
      const data = await response.json();
      const imageUrl = data.resolvedUrl;

      // Create the slide dynamically
      const slideDiv = document.createElement('div');
      slideDiv.classList.add('mySlides', 'fade');

      const centerTag = document.createElement('center');

      const imgElement = document.createElement('img');
      imgElement.src = imageUrl;
      imgElement.style.maxWidth = '75vh';
      imgElement.id = 'myImg';

      centerTag.appendChild(imgElement);
      slideDiv.appendChild(centerTag);

      const textDiv = document.createElement('div');
      textDiv.classList.add('text');
      textDiv.innerText = `Post ID: ${postId}`;

      slideDiv.appendChild(textDiv);

      // Append to slideshow container
      const slideshowContainer = document.querySelector('.slideshow-container');
      slideshowContainer.appendChild(slideDiv);
    } else {
      console.error('Failed to resolve media:', await response.json());
    }
  } catch (error) {
    console.error('Error resolving media:', error);
  }
}

// Example usage
const postIds = ['DCoxW5oyyT7', 'DCCVFOFy_ce']; // List of post IDs
postIds.forEach(postId => resolveAndSetImage(postId));
