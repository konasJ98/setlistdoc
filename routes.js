const express = require('express');
const fs = require('fs-extra'); // For file system operations
const path = require('path'); // For path manipulations

const app = express();
const port = 3000;

// Base directory for dynamic folders
const baseDir = path.join(__dirname, 'dynamicFolders');

// Middleware to serve static files (like index.html) from the dynamic folder
app.use((req, res, next) => {
  const requestedPath = req.path === '/' ? '/index' : req.path; // Handle root as "/index"
  const folderPath = path.join(baseDir, requestedPath);
  const indexPath = path.join(folderPath, 'index.html');

  // If the folder and index.html exist, serve the file
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    next(); // Proceed to the next middleware (wildcard handler)
  }
});

// Wildcard route for handling arbitrary requests
app.get('/*', async (req, res) => {
  // Get the requested path (remove leading "/")
  const requestedPath = req.params[0] || 'index'; // Handle "/" as "index"
  const folderPath = path.join(baseDir, requestedPath);

  try {
    // Check if the folder exists, create it if it doesn't
    if (!fs.existsSync(folderPath)) {
      console.log(`Creating folder: ${folderPath}`);
      await fs.ensureDir(folderPath);

      // Add a default index.html to the folder
      const defaultIndexPath = path.join(folderPath, 'index.html');
      const defaultContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${requestedPath}</title>
        </head>
        <body>
          <h1>Welcome to ${requestedPath}</h1>
          <p>This is your dynamically generated page.</p>
        </body>
        </html>
      `;
      await fs.writeFile(defaultIndexPath, defaultContent);
    }

    // Redirect to the newly created folder's index.html
    res.redirect(req.path);
  } catch (error) {
    console.error(`Error handling request for ${requestedPath}:`, error);
    res.status(500).send('An error occurred.');
  }
});

// Serve the main index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
