// Chargement des variables d'environnement depuis un fichier .env
require('dotenv').config();

// Importation des modules nécessaires
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware pour gérer les requêtes CORS (Cross-Origin Resource Sharing).
// Ceci permet à votre serveur de répondre aux requêtes provenant de différents domaines.
app.use(cors());

// Middleware pour analyser les requêtes JSON entrantes.
app.use(express.json());

// Route POST pour l'API de chat
app.post('/api/chat', async (req, res) => {
    try {
        const { text } = req.body;
        
        
        // Configuration des paramètres de la requête vers l'API OpenAI
        const openAIConfig = {
            model: "text-davinci-003",  //On choisi notre model le plus adapté
            prompt: " Donne moi une suite logique et présise à cette phrase : " + text,
            max_tokens: 100, // Augmenté pour obtenir une réponse plus complète
            temperature: 0.7,  // Plus on est proche 1 plus on est créatif
        };

        // Configuration des en-têtes pour la requête vers l'API OpenAI
        const headersConfig = {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        };
        
        // Envoi de la requête à l'API OpenAI
        const response = await axios.post('https://api.openai.com/v1/completions', openAIConfig, { headers: headersConfig });

        // Extraction et nettoyage de la réponse de l'API OpenAI
        const openaiResponse = response.data.choices[0].text.trim();

        // Envoi de la réponse au client
        res.json({ response: openaiResponse });

    } catch (error) {
        // En cas d'erreur avec la requête OpenAI, log l'erreur et envoie un message d'erreur générique au client.
        console.error("Erreur OpenAI:", error.response?.data); // Utilisation de l'optional chaining pour éviter les erreurs si 'error.response' est undefined
        res.status(500).json({ error: 'Une erreur s’est produite lors de la communication avec OpenAI.' });
    }
});

// Démarrage du serveur sur le port spécifié
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

