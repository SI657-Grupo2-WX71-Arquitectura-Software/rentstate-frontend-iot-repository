import axios from 'axios';
let myAxiosRequester = axios.create({
    baseURL: 'https://www.credizone.online:8089/api/v1/mobile/',
    timeout: 5000,
});
export default myAxiosRequester;