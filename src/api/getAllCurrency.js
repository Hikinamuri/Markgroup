import axios from 'axios';
import { baseUrl } from '../utils/baseUrlConstant';

axios.defaults.baseURL = baseUrl;

export const getAllCurrency = async () => {
    const url = '/daily_json.js'
    return await axios.get(url);
}