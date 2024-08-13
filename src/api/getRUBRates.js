import axios from 'axios';
import { baseUrl } from '../utils/baseUrlConstant';

axios.defaults.baseURL = baseUrl;

export const getRUBRates = async () => {
    const url = '/latest.js'
    const response = await axios.get(url);
    
    return response;
}