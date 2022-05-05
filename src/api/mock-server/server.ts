import { setupServer } from 'msw/node';
import { mocksAuth } from './auth';
import { mocksDiki } from './diki';
import { mocksSets } from './sets';
import { mocksWords } from './words';
import { mocksUser } from './user';

export const MockServer = setupServer(
  ...mocksAuth,
  ...mocksDiki,
  ...mocksSets,
  ...mocksWords,
  ...mocksUser
)
