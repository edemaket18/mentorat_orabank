// backend/index.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Exemple de route API
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// Démarrage du serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ API server listening on http://localhost:${PORT}`);
});
