const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users'); // Nouvelle ligne avec 'users'

const router = express.Router();

// Inscription d'un utilisateur
app.post('/auth/register', async (req, res) => {
  try {
      const { username, email, password } = req.body; // Assurez-vous que le frontend envoie bien ces champs.
      console.log("Données reçues :", req.body);

      // Validation des données
      if (!username || !email || !password) {
          return res.status(400).json({ error: 'Tous les champs sont requis.' });
      }

      // Lecture du fichier JSON des utilisateurs
      const users = fs.existsSync(usersFilePath)
          ? JSON.parse(fs.readFileSync(usersFilePath, 'utf8'))
          : [];

      // Vérification si l'email est déjà utilisé
      if (users.some((user) => user.email === email)) {
          return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
      }

      // Hashage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Création d'un nouvel utilisateur
      const newUser = { username, email, password: hashedPassword };
      users.push(newUser);

      // Sauvegarde dans le fichier JSON
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

      console.log("Utilisateur enregistré :", newUser);
      res.status(201).json({ message: 'Inscription réussie.' });
  } catch (err) {
      console.error("Erreur lors de l'inscription :", err);
      res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Connexion d'un utilisateur
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Utilisateur non trouvé');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).send('Mot de passe incorrect');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(400).send('Erreur lors de la connexion');
  }
});

module.exports = router;
