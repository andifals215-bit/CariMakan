const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const THEMEALDB_URL = 'https://www.themealdb.com/api/json/v1/1';

// Get meals, optionally by search query
app.get('/api/meals', async (req, res) => {
    try {
        const query = req.query.search || '';
        const response = await axios.get(`${THEMEALDB_URL}/search.php?s=${query}`);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching meals:", error.message);
        res.status(500).json({ message: "Failed to fetch meals from TheMealDB" });
    }
});

// Get meal by id
app.get('/api/meals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${THEMEALDB_URL}/lookup.php?i=${id}`);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching meal detail:", error.message);
        res.status(500).json({ message: "Failed to fetch meal detail from TheMealDB" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
