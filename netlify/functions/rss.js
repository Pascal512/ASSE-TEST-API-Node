const axios = require('axios');
const xml2js = require('xml2js');

const rssLinks = [
    "https://example.com/rss1.xml",
    "https://example.com/rss2.xml",
    "https://example.com/rss3.xml"
];

const fetchAndConvertRSS = async (url) => {
    try {
        const response = await axios.get(url);
        const xml = response.data;
        const json = await xml2js.parseStringPromise(xml, { mergeAttrs: true });
        return json;
    } catch (error) {
        throw new Error('Erreur lors de la récupération du flux RSS');
    }
};

exports.handler = async (event) => {
    const number = parseInt(event.queryStringParameters.number);

    if (number >= 0 && number < rssLinks.length) {
        const rssLink = rssLinks[number];
        try {
            const rssContent = await fetchAndConvertRSS(rssLink);
            return {
                statusCode: 200,
                body: JSON.stringify(rssContent),
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: 'Erreur lors de la récupération du flux RSS.',
            };
        }
    } else {
        return {
            statusCode: 400,
            body: 'Numéro invalide.',
        };
    }
};
