const axios = require('axios');
module.exports = async (req, res) => {
    try {
        console.log("=== SEARCH API START ===");
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        if (req.method === 'OPTIONS') return res.status(200).end();

        const query = req.query?.query || '';
        console.log("QUERY:", query);

        const ALADDIN_TTB_KEY = process.env.ALADDIN_TTB_KEY;
        console.log("KEY:", ALADDIN_TTB_KEY);

        if (!ALADDIN_TTB_KEY) return res.status(500).json({ error: 'ALADDIN_TTB_KEY missing' });
        if (!query) return res.status(400).json({ error: 'query missing' });

        const url = `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx`
            + `?ttbKey=${ALADDIN_TTB_KEY}`
            + `&Query=${encodeURIComponent(query)}`
            + `&QueryType=Keyword`   // ✅ Title → Keyword 로 변경
            + `&MaxResults=5`
            + `&start=1`
            + `&SearchTarget=Book`
            + `&output=js`           // ✅ jsv2 → js 로 변경
            + `&Version=20131101`;
            + `&OptResult=subInfo`; // ✅ 페이지수(itemPage) 포함하기 위해 추가

        console.log("URL:", url);
        const response = await axios.get(url);
        console.log("ALADDIN RESPONSE:", JSON.stringify(response.data).slice(0, 200));

        // ✅ XML 에러 응답 방어 처리
        if (typeof response.data === 'string' && response.data.includes('<error>')) {
            return res.status(500).json({ error: '알라딘 API 오류', raw: response.data });
        }

        return res.status(200).json(response.data);

    } catch (error) {
        console.error("SEARCH ERROR:", error.message);
        return res.status(500).json({ error: error.message });
    }
};
