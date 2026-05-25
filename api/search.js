const axios = require('axios');

module.exports = async (req, res) => {

    try {

        console.log("=== SEARCH API START ===");

        // CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        // OPTIONS 처리
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

        // query 선언 먼저
        const query = req.query?.query || '';

        console.log("QUERY:", query);

        // 환경변수
        const ALADDIN_TTB_KEY = process.env.ALADDIN_TTB_KEY;

        console.log("KEY:", ALADDIN_TTB_KEY);

        if (!ALADDIN_TTB_KEY) {
            return res.status(500).json({
                error: 'ALADDIN_TTB_KEY missing'
            });
        }

        if (!query) {
            return res.status(400).json({
                error: 'query missing'
            });
        }

        const url =
            `https://www.aladdin.co.kr/ttb/api/ItemSearch.aspx?ttbKey=${ALADDIN_TTB_KEY}&Query=${encodeURIComponent(query)}&QueryType=Title&MaxResults=5&start=1&SearchTarget=Book&output=js&Version=20131101`;

        console.log("URL:", url);

        const response = await axios.get(url);

        console.log("ALADDIN RESPONSE SUCCESS");

        return res.status(200).json(response.data);

    } catch (error) {

        console.error("SEARCH ERROR:", error);

        return res.status(500).json({
            error: error.message
        });
    }
};
