const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Client } = require('@notionhq/client');

const app = express();
app.use(cors());
app.use(express.json());

// 환경 변수 설정 필요
const ALADDIN_TTB_KEY = process.env.ALADDIN_TTB_KEY;
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

const notion = new Client({ auth: NOTION_API_KEY });

// 1. 알라딘 책 검색 API
app.get('/search', async (req, res) => {
    const { query } = req.query;
    try {
        const url = `https://www.aladdin.co.kr/ttb/api/ItemSearch.aspx?TTBKey=${ALADDIN_TTB_KEY}&Query=${encodeURIComponent(query)}&QueryType=Title&MaxResults=5&start=1&SearchTarget=Book&output=js&Version=20131101`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. 노션 DB에 추가 API
app.post('/add-to-notion', async (req, res) => {
    const book = req.body;
    
    try {
        // 상세 정보(페이지 수 포함)를 위해 상품 조회 API 추가 호출 필요 시 이 단계에서 수행
        // const detailUrl = `...ItemLookUp.aspx...`; 
        const pageCount = book.subInfo?.itemPage || 0; // 예시 (조회 API 결과에 따라 파싱 필요)

        await notion.pages.create({
            parent: { database_id: NOTION_DATABASE_ID },
            icon: { type: "external", external: { url: book.cover } }, // 책 표지를 페이지 아이콘으로 설정
            properties: {
                "도서명": {
                    title: [{ text: { content: book.title } }]
                },
                "저자": {
                    rich_text: [{ text: { content: book.author } }]
                },
                "출판사": {
                    select: { name: book.publisher }
                },
                "ISBN": {
                    rich_text: [{ text: { content: book.isbn13 || book.isbn } }]
                },
                "페이지 수": {
                    number: Number(pageCount)
                },
                "표지 이미지 URL": {
                    url: book.cover
                }
            }
        });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
