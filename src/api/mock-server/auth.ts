import { rest, RestRequest } from 'msw';
import { parseCookies } from './cookies';

export const mocksAuth = [
  rest.post('/api/v1/auth/log-in', (req: RestRequest<any, any>, res, ctx) => {
    const { email } = req.body;

    if (email === 'success@example.com') {
      return res(
        ctx.status(200),
        ctx.cookie('ACCESS', 'VALID-ACCESS-TOKEN'),
        ctx.cookie('REFRESH', 'VALID-REFRESH-TOKEN'),
        ctx.json({
          status: 200,
          data: {
            name: 'TestUser',
            sync: true
          }
        })
      )
    }

    if (email === 'invalidWithoutJson@example.com') {
      return res(
        ctx.status(403),
      )
    }

    return res(
      ctx.status(403),
      ctx.json({
        status: 403,
        message: "Wrong login or password"
      })
    )
  }),

  rest.post('/api/v1/auth/log-out', (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.cookie('ACCESS', ''),
      ctx.cookie('REFRESH', ''),
      ctx.cookie('LOCALLY', ''),
      ctx.json({
        status: 200,
        message: 'success'
      })
    );
  }),

  rest.post('/api/v1/auth/use-no-sync', (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.cookie('LOCALLY', 'VALID-LOCALLY-TOKEN'),
      ctx.cookie('ACCESS', 'VALID-ACCESS-TOKEN'),
      ctx.json({
        status: 200,
        data: {
          name: 'Anonymous',
          sync: false
        }
      })
    )
  }),

  rest.post('/api/v1/auth/create-refresh-token', (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.cookie('ACCESS', ''),
      ctx.cookie('LOCALLY', ''),
      ctx.cookie('REFRESH', 'VALID-REFRESH-TOKEN'),
      ctx.json({
        status: 200,
        message: 'success'
      })
    )
  }),

  rest.post('/api/v1/auth/create-locally-token', (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.cookie('ACCESS', ''),
      ctx.cookie('REFRESH', ''),
      ctx.cookie('LOCALLY', 'VALID-LOCALLY-TOKEN'),
      ctx.json({
        status: 200,
        message: 'success'
      })
    )
  }),

  rest.post('/api/v1/auth/refresh', (req: RestRequest<any, any>, res, ctx) => {
    const { REFRESH, LOCALLY } = parseCookies();

    if (REFRESH === 'VALID-REFRESH-TOKEN') {
      return res(
        ctx.status(200),
        ctx.cookie('ACCESS', 'VALID-ACCESS-TOKEN'),
        ctx.cookie('REFRESH', 'VALID-REFRESH-TOKEN'),
        ctx.json({
          status: 200,
          data: {
            name: 'TestUser',
            sync: true
          }
        })
      )
    }

    if (LOCALLY === 'VALID-LOCALLY-TOKEN') {
      return res(
        ctx.status(200),
        ctx.cookie('ACCESS', 'VALID-ACCESS-TOKEN'),
        ctx.cookie('REFRESH', 'VALID-REFRESH-TOKEN'),
        ctx.json({
          status: 200,
          data: {
            name: 'Anonymous',
            sync: false
          }
        })
      )
    }

    return res(
      ctx.status(401),
      ctx.json({
        status: 401,
        message: "Unauthorized"
      })
    )
  }),

  rest.post('/api/v1/auth/confirm-account', (req: RestRequest<any, any>, res, ctx) => {
    const { token } = req.body;

    if (token === 'VALID-CONFIRMATION-TOKEN') {
      return res(
        ctx.status(200),
        ctx.json({
          status: 200,
          message: "success"
        })
      )
    }

    if (token === 'INVALID-CONFIRMATION-TOKEN-WITHOUT-JSON') {
      return res(
        ctx.status(403),
      )
    }

    return res(
      ctx.status(403),
      ctx.json({
        status: 403,
        message: "Your token has expired. A new one has been generated and sent, check your email."
      })
    )
  }),

  rest.post('/api/v1/auth/register', (req: RestRequest<any, any>, res, ctx) => {
    const { email } = req.body;

    if (email === 'success@example.com') {
      return res(
        ctx.status(200),
        ctx.json({
          status: 200,
          message: "success"
        })
      )
    }

    if (email === 'invalidWithoutJson@example.com') {
      return res(
        ctx.status(403),
      )
    }

    return res(
      ctx.status(409),
      ctx.json({
        status: 409,
        message: "User with that email already exist"
      })
    )
  }),

  rest.post('/api/v1/auth/send-password-reset-email', (req: RestRequest<any, any>, res, ctx) => {
    const { email } = req.body;

    if (email === 'success@example.com') {
      return res(
        ctx.status(200),
        ctx.json({
          status: 200,
          message: "success"
        })
      )
    }

    if (email === 'invalidWithoutJson@example.com') {
      return res(
        ctx.status(404),
      )
    }

    return res(
      ctx.status(404),
      ctx.json({
        status: 404,
        message: "User with that email not exist"
      })
    )
  }),

  rest.post('/api/v1/auth/reset-password', (req: RestRequest<any, any>, res, ctx) => {
    const { token } = req.body;

    if (token === 'VALID-RESET-PASSWORD-TOKEN') {
      return res(
        ctx.status(200),
        ctx.json({
          status: 200,
          message: "success"
        })
      )
    }

    if (token === 'INVALID-RESET-PASSWORD-TOKEN-WITHOUT-JSON') {
      return res(
        ctx.status(403),
      )
    }

    return res(
      ctx.status(403),
      ctx.json({
        status: 403,
        message: "Your token has expired."
      })
    )
  }),
]

