import axios from 'axios';

export const getAllCurrency = async () => {
    const url = 'https://www.cbr-xml-daily.ru/daily_json.js'
    const response = await axios.get(url);
    
    return response;
}