const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'public', 'data', 'listings.json');

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { listings: [], cities: [], amenityLabels: {} };
  }
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const data = readData();
    const url = new URL(req.url, `http://${req.headers.host}`);
    const idParam = url.searchParams.get('id');

    if (idParam) {
      const listing = data.listings.find(l => l.id === idParam);
      if (!listing) return res.status(404).json({ error: 'Listing not found' });
      return res.status(200).json(listing);
    }
    return res.status(200).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed. Use admin panel for CRUD operations.' });
};
