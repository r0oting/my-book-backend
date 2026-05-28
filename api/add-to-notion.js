const { Client } = require('@notionhq/client');
const notion = new Client({
    auth: process.env.NOTION_API_KEY
});
module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // OPTIONS 처리
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    const book = req.body;

    // 오늘 날짜 (YYYY-MM-DD) - 한국 시간 기준
    const today = new Date().toLocaleDateString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\. /g, '-').replace('.', '');

    try {
        await notion.pages.create({
            parent: {
                database_id: process.env.NOTION_DATABASE_ID
            },
            // ✅ 표지를 페이지 커버로 설정 (기존 표지 files 속성 건드리지 않음)
            cover: book.cover ? {
                type: 'external',
                external: { url: book.cover }
            } : undefined,
            properties: {
                "도서명": {
                    title: [{ text: { content: book.title || '' } }]
                },
                "저자": {
                    rich_text: [{ text: { content: book.author || '' } }]
                },
                "ISBN": {
                    rich_text: [{ text: { content: book.isbn13 || '' } }]
                },
                // ✅ 날짜 속성 - 시작일만 오늘로 (종료일 없음)
                "날짜": {
                    date: { start: today }
                }
            }
        });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
