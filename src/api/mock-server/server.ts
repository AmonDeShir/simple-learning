import { setupServer } from 'msw/node';
import { mocksAuth } from './auth';

export const MockServer = setupServer(
  ...mocksAuth
)
