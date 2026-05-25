const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Client } = require('@notionhq/client');

const app = express();
app.use(cors());
app.use(express.json());

// 외부에서 내 API 키를 직접 볼 수 없게 '환경변수' 처리합니다.
const ALADDIN_TTB_KEY = process.env.ALADDIN_TTB_KEY;
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

const notion = new Client({ auth: NOTION_API_KEY });

app.get('/api/search', async (req, res) => {
    const { query } = req.query;
    try {
        const url = `http://www.aladdin.co.kr/ttb/api/ItemSearch.aspx?TTBKey=${ALADDIN_TTB_KEY}&Query=${encodeURIComponent(query)}&QueryType=Title&MaxResults=5&start=1&SearchTarget=Book&output=js&Version=20131101`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/add-to-notion', async (req, res) => {
    const book = req.body;
    try {
        await notion.pages.create({
            parent: { database_id: NOTION_DATABASE_ID },
            icon: { type: "external", external: { url: book.cover } },
            properties: {
                "책 이름": { title: [{ text: { content: book.title } }] },
                "저자": { rich_text: [{ text: { content: book.author } }] },
                "출판사": { select: { name: book.publisher } },
                "ISBN": { rich_text: [{ text: { content: book.isbn13 || book.isbn } }] }
            }
        });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;