const axios = require('axios');

module.exports = async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const query = req.query.query;

    const ALADDIN_TTB_KEY = process.env.ALADDIN_TTB_KEY;

    try {

        const url =
            `https://www.aladdin.co.kr/ttb/api/ItemSearch.aspx?TTBKey=${ALADDIN_TTB_KEY}&Query=${encodeURIComponent(query)}&QueryType=Title&MaxResults=5&start=1&SearchTarget=Book&output=json&Version=20131101`;

        const response = await axios.get(url);

        return res.status(200).send(JSON.stringify(response.data));

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: error.message
        });
    }
};
