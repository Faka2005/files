const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Charger les fichiers JSON contenant les données
const filesDataFiles = JSON.parse(fs.readFileSync('files.json', 'utf-8'));
const filesDataImages = JSON.parse(fs.readFileSync('images.json', 'utf-8'));

// Combiner les deux tableaux de fichiers en un seul pour faciliter la recherche
const allFilesData = [...filesDataFiles, ...filesDataImages];

// Endpoint pour récupérer le chemin d'un fichier via son nom
app.get('/file/:name', (req, res) => {
  const fileName = req.params.name;

  // Rechercher le fichier correspondant dans les données combinées
  const file = allFilesData.find((f) => f.name === fileName);

  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }

  // Résoudre et envoyer le fichier si disponible
  const filePath = path.resolve(__dirname, file.path);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'File path does not exist' });
  }
});

// Endpoint spécifique pour les images
app.get('/image/:name', (req, res) => {
  const imageName = req.params.name;

  // Rechercher uniquement dans les données d'images
  const image = filesDataImages.find((img) => img.name === imageName);

  if (!image) {
    return res.status(404).json({ error: 'Image not found' });
  }

  // Résoudre et envoyer l'image si disponible
  const imagePath = path.resolve(__dirname, image.path);
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ error: 'Image path does not exist' });
  }
});

// Endpoint de test pour voir tous les fichiers disponibles
app.get('/files', (req, res) => {
  res.json(allFilesData);
});

// Endpoint de test pour voir uniquement les images disponibles
app.get('/images', (req, res) => {
  res.json(filesDataImages);
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
