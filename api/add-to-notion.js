const { Client } = require('@notionhq/client');

const notion = new Client({
    auth: process.env.NOTION_API_KEY
});

module.exports = async (req, res) => {

    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');

    // OPTIONS 처리
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const book = req.body;

    try {

        await notion.pages.create({
            parent: {
                database_id: process.env.NOTION_DATABASE_ID
            },
            properties: {
                "도서명": {
                    title: [
                        {
                            text: {
                                content: book.title || ''
                            }
                        }
                    ]
                },

                "저자": {
                    rich_text: [
                        {
                            text: {
                                content: book.author || ''
                            }
                        }
                    ]
                },

                "ISBN": {
                    rich_text: [
                        {
                            text: {
                                content: book.isbn13 || ''
                            }
                        }
                    ]
                }
            }
        });

        res.status(200).json({
            success: true
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
};
