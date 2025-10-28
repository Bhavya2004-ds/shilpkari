const express = require('express');
const router = express.Router();
const natural = require('natural');
const { SentimentAnalyzer, PorterStemmer } = natural;
const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

// Analyze text sentiment
router.post('/analyze', (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide valid text for analysis' 
            });
        }

        // Tokenize the text
        const tokenizer = new natural.WordTokenizer();
        const tokens = tokenizer.tokenize(text);
        
        // Get sentiment score (-1 to 1)
        const score = analyzer.getSentiment(tokens);
        
        // Categorize sentiment
        let sentiment = 'neutral';
        if (score > 0.1) sentiment = 'positive';
        else if (score < -0.1) sentiment = 'negative';

        res.json({
            success: true,
            data: {
                score,
                sentiment,
                tokens
            }
        });
    } catch (error) {
        console.error('Sentiment analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Error performing sentiment analysis',
            error: error.message
        });
    }
});

module.exports = router;
