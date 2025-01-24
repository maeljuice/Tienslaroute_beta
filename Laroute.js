const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

const markersFilePath = path.join(__dirname, 'markers.json');

// Route pour afficher la page de la carte
app.get('/map', (req, res) => {
  res.sendFile(__dirname + '/views/map.html');
});

// Route pour sauvegarder un marqueur avec le nom de l'aire
app.post('/save-marker', (req, res) => {
  const { latitude, longitude, nom } = req.body;

  fs.readFile(markersFilePath, 'utf8', (err, data) => {
    let markers = [];
    if (!err && data) {
      markers = JSON.parse(data);
    }

    markers.push({ latitude, longitude, nom });

    fs.writeFile(markersFilePath, JSON.stringify(markers, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la sauvegarde des marqueurs.' });
      }
      res.status(200).json({ message: 'Marqueur sauvegardé avec succès.' });
    });
  });
});

// Route pour récupérer les marqueurs
app.get('/get-markers', (req, res) => {
  fs.readFile(markersFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la lecture des marqueurs.' });
    }
    const markers = data ? JSON.parse(data) : [];
    res.status(200).json(markers);
  });
});

// Lancer le serveur
const PORT = process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Accessible sur le réseau à l'adresse : http://10.5.19.19:${PORT}`);
});
