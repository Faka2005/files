const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Charger les fichiers JSON contenant les données
const filesDataFiles = JSON.parse(fs.readFileSync('files.json', 'utf-8'));
const filesDataImages = JSON.parse(fs.readFileSync('images.json', 'utf-8'));
// const filesDataVideo = JSON.parse(fs.readFileSync('video.json', 'utf-8'));
// const filesDataAudio = JSON.parse(fs.readFileSync('audio.json', 'utf-8')); // Charger les fichiers audio

// Combiner tous les fichiers pour les recherches générales
const allFilesData = [
  ...filesDataFiles,
  ...filesDataImages,
  // ...filesDataVideo,
  // ...filesDataAudio,
];

// Page principale
app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Message Spécial</title>
    </head>
    <body>
      <h1>Joyeux Anniversaire, ma meilleure amie !</h1>
      <p>Chère amie, en ce jour spécial, je tiens à te dire à quel point tu es importante pour moi. Que cette nouvelle année t'apporte des moments de bonheur, de rires et de succès. Tu es une personne incroyable et je suis tellement reconnaissant(e) de t'avoir à mes côtés.</p>
      
      <h2>Et maintenant... une demande spéciale...</h2>
      <p>Je voudrais te poser une question importante, une question qui me trotte dans la tête depuis un certain temps...</p>
      <h3>Veux-tu m'épouser ?</h3>
      <p>Je ne peux imaginer ma vie sans toi, et je souhaite passer le reste de mes jours à te rendre heureuse. Alors, ma meilleure amie et la personne la plus précieuse dans ma vie, accepteras-tu de partager ton avenir avec moi ?</p>
    </body>
    </html>
  `;
  res.send(html);
});


// Liste des fichiers
app.get('/files', (req, res) => {
  const fileLinks = filesDataFiles
    .map((file) => `<li><a href="/files/${file.name}">${file.name}</a></li>`)
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Liste des Fichiers</title>
    </head>
    <body>
      <h1>Liste des Fichiers Disponibles</h1>
      <ul>
        ${fileLinks}
      </ul>
    </body>
    </html>
  `;
  res.send(html);
});

// Liste des images
app.get('/images', (req, res) => {
  const imageLinks = filesDataImages
    .map((image) => `<li><a href="/images/${image.name}">${image.name}</a></li>`)
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Liste des Images</title>
    </head>
    <body>
      <h1>Liste des Images Disponibles</h1>
      <ul>
        ${imageLinks}
      </ul>
    </body>
    </html>
  `;
  res.send(html);
});

// // Liste des vidéos
// app.get('/video', (req, res) => {
//   const videoLinks = filesDataVideo
//     .map(
//       (video) =>
//         `<li>
//           <video controls width="300">
//             <source src="/video/${video.name}" type="video/mp4">
//             Votre navigateur ne supporte pas les vidéos HTML5.
//           </video>
//         </li>`
//     )
//     .join('');

//   const html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <title>Liste des Vidéos</title>
//     </head>
//     <body>
//       <h1>Liste des Vidéos Disponibles</h1>
//       <ul>
//         ${videoLinks}
//       </ul>
//     </body>
//     </html>
//   `;
//   res.send(html);
// });

// // Liste des audios
// app.get('/audio', (req, res) => {
//   const audioLinks = filesDataAudio
//     .map(
//       (audio) =>
//         `<li>
//           <audio controls>
//             <source src="/audio/${audio.name}" type="audio/mpeg">
//             Votre navigateur ne supporte pas les audios HTML5.
//           </audio>
//           <p>${audio.name}</p>
//         </li>`
//     )
//     .join('');

//   const html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <title>Liste des Audios</title>
//     </head>
//     <body>
//       <h1>Liste des Audios Disponibles</h1>
//       <ul>
//         ${audioLinks}
//       </ul>
//     </body>
//     </html>
//   `;
//   res.send(html);
// });

// Détails d'un fichier
app.get('/files/:name', (req, res) => {
  const fileName = req.params.name;
  const file = allFilesData.find((f) => f.name === fileName);

  if (!file) {
    return res.status(404).json({ error: 'Fichier introuvable' });
  }

  const filePath = path.resolve(__dirname, file.path);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "Le chemin du fichier n'existe pas" });
  }
});

// Détails d'une image
app.get('/images/:name', (req, res) => {
  const imageName = req.params.name;
  const image = filesDataImages.find((img) => img.name === imageName);

  if (!image) {
    return res.status(404).json({ error: 'Image introuvable' });
  }

  const imagePath = path.resolve(__dirname, image.path);
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ error: "Le chemin de l'image n'existe pas" });
  }
});

// // Détails d'une vidéo
// app.get('/video/:name', (req, res) => {
//   const videoName = req.params.name;
//   const video = filesDataVideo.find((v) => v.name === videoName);

//   if (!video) {
//     return res.status(404).json({ error: 'Vidéo introuvable' });
//   }

//   const videoPath = path.resolve(__dirname, video.path);
//   if (fs.existsSync(videoPath)) {
//     res.sendFile(videoPath);
//   } else {
//     res.status(404).json({ error: "Le chemin de la vidéo n'existe pas" });
//   }
// });

// // Détails d'un audio
// app.get('/audio/:name', (req, res) => {
//   const audioName = req.params.name;
//   const audio = filesDataAudio.find((a) => a.name === audioName);

//   if (!audio) {
//     return res.status(404).json({ error: 'Audio introuvable' });
//   }

//   const audioPath = path.resolve(__dirname, audio.path);
//   if (fs.existsSync(audioPath)) {
//     res.sendFile(audioPath);
//   } else {
//     res.status(404).json({ error: "Le chemin de l'audio n'existe pas" });
//   }
// });

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
