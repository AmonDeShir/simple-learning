import { rest } from 'msw';

export const mocksUser = [
  rest.post(`/api/v1/user/save-word`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        message: 'success',
      })
    )
  }),

];