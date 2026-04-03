const express = require('express');
const cors = require('cors');
const path = require('path');
const listingsHandler = require('./api/listings');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.all('/api/listings', listingsHandler);

// Hidden admin route
app.get('/sau85_hivu85', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// Block old admin URLs
app.get(['/admin.html', '/admin'], (req, res) => res.status(404).send('Not found'));

// Static files (serve .html files directly)
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html']
}));

// 404 fallback — only for non-file routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Hive4U server running at http://localhost:${PORT}`);
});
