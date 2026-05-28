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
 
    // 오늘 날짜 (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
 
    try {
        await notion.pages.create({
            parent: {
                database_id: process.env.NOTION_DATABASE_ID
            },
            // ✅ 표지 이미지를 페이지 커버로 설정
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
                // ✅ 오늘 날짜
                "등록일": {
                    date: { start: today }
                },
                // ✅ 표지 URL을 별도 필드에도 저장 (노션 DB에 "표지" URL 속성이 있는 경우)
                "표지": {
                    url: book.cover || null
                }
            }
        });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
