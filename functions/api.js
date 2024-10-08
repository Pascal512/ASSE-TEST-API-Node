const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();
const axios = require('axios');
const xml2js = require('xml2js');

let rssLinks = [
    "https://paris-supporters.fr/feed",
    "https://madeinparisiens.ouest-france.fr/flux/rss_news.php",
    "https://www.culturepsg.com/news?rss",
    "https://www.foot01.com/equipe/paris/news.rss",
    "https://www.paristeam.fr/feed",
    "https://psgcommunity.com/feed/",
    "https://canal-supporters.com/feed/",
    "https://allezparis.fr/feed",
    "https://dwh.lequipe.fr/api/edito/rss?path=/Football/Paris-sg/"
];

// Middleware pour forcer les réponses JSON
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Fonction pour récupérer et transformer le flux RSS
const fetchAndConvertRSS = async (url) => {
    try {
        // Récupérer le flux RSS (XML)
        const response = await axios.get(url);
        const xml = response.data;

        // Transformer le XML en JSON
        const json = await xml2js.parseStringPromise(xml, { mergeAttrs: true });
        return json;
    } catch (error) {
        console.error("Erreur lors de la récupération du flux RSS : ", error);
        throw error;
    }
};

// Root
router.get('/', (req, res) => {
    res.json({
        response: 'API en marche'
    });
});

// Root
router.get('/:number', async (req, res) => {
    const number = parseInt(req.params.number);

    // Vérifier si le numéro est valide
    if (number >= 0 && number < rssLinks.length) {
        const rssLink = rssLinks[number];
        try {
            const rssContent = await fetchAndConvertRSS(rssLink);
            res.json(JSON.parse(rssContent));  // Retourne le contenu RSS converti en JSON
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération du flux RSS.',
            });
        }
    } else {
        res.status(400).json({
            success: false,
            message: 'Numéro invalide.',
        });
    }
});

//router.get('/', (req, res) => {});

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);

