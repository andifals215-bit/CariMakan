import axios from 'axios';

const isProd = import.meta.env.PROD;

export const getMeals = async (query = '') => {
    if (isProd) {
        // Direct fetch from TheMealDB in production so live deployment works
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        return response.data;
    } else {
        // Local Express backend proxy in development
        const response = await axios.get(`http://localhost:5000/api/meals?search=${query}`);
        return response.data;
    }
};

export const getMealDetail = async (id) => {
    if (isProd) {
        // Direct fetch from TheMealDB in production so live deployment works
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        return response.data;
    } else {
        // Local Express backend proxy in development
        const response = await axios.get(`http://localhost:5000/api/meals/${id}`);
        return response.data;
    }
};
