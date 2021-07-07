import axios from 'axios';
import { config } from '../config';

export const client = axios.create({
  timeout: 20000,
  baseURL: config.api.baseURL,
  params: {
    access_key: config.api.accessKey,
  },
});
