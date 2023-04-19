import axios from 'axios';

export const client = axios.create({
  baseURL: 'http://localhost:8000', // TODO: make this dynamic
  headers: {
    'Content-Type': 'application/json',
  },
});

// const initializeClientWithCredentials = (pin: number) => {
//     client.defaults.headers.common['Authorization'] = `Bearer ${pin}`;
// }

export const initializeClientWithCredentials = (pin: number) => {
  return axios.create({
    baseURL: 'http://localhost:8000', // TODO: make this dynamic
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pin}`,
    },
  });
};
