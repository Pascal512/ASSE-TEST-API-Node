const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');

const app = express();
const port = 3000;

// Tableau de liens RSS
const rssLinks = [
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

// Endpoint GET qui prend un numéro en paramètre
app.get('/rss/:number', async (req, res) => {
    const number = parseInt(req.params.number);

    // Vérifier si le numéro est valide
    if (number >= 0 && number < rssLinks.length) {
        const rssLink = rssLinks[number];
        try {
            const rssContent = await fetchAndConvertRSS(rssLink);
            res.json(rssContent);  // Retourne le contenu RSS converti en JSON
        } catch (error) {
            res.status(500).send('Erreur lors de la récupération du flux RSS.');
        }
    } else {
        res.status(400).send('Numéro invalide.');
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`API démarrée sur http://localhost:${port}`);
});
