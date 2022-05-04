import { rest } from 'msw';
import { dikiResult } from './data/diki.data';

export const mocksDiki = [
  rest.get(`/api/v1/diki/search/word`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        data: dikiResult,
      })
    )
  }),

  rest.get(`/api/v1/diki/search/New%20Word`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        data: dikiResult,
      })
    )
  }),

  rest.get(`/api/v1/diki/search/empty`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        data: [],
      })
    )
  }),

  rest.get(`/api/v1/diki/search/error`, (req, res, ctx) => {
    return res(
      ctx.status(404),
      ctx.json({
        status: 404,
        message: 'Not Found',
      })
    )
  }),
];