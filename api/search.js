const axios = require('axios');

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');

    const query = req.query.query;

    const ALADDIN_TTB_KEY = process.env.ALADDIN_TTB_KEY;

    try {
        const url = `https://www.aladdin.co.kr/ttb/api/ItemSearch.aspx?TTBKey=${ALADDIN_TTB_KEY}&Query=${encodeURIComponent(query)}&QueryType=Title&MaxResults=5&start=1&SearchTarget=Book&output=js&Version=20131101`;

        const response = await axios.get(url);

        res.status(200).json(response.data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
};
