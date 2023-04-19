import { initializeClientWithCredentials } from './lib';
import { userStore } from './context';
import { z } from 'zod';

(async () => {
  const client = initializeClientWithCredentials(1234);

  const users = await client.get('/users');

  console.log(users.status);

  return console.log('hey there stranger!');
})();
