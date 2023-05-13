import { rest } from 'msw';
import { dikiResult } from './data/diki.data';
import { Interslavic } from './data/interslavic.data';

export const mocksDiki = [
  rest.get(`/api/v1/dictionary/search/word`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        data: dikiResult,
      })
    )
  }),

  rest.get(`/api/v1/dictionary/search/interslavic`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        data: Interslavic,
      })
    )
  }),

  rest.get(`/api/v1/dictionary/search/New%20Word`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        data: dikiResult,
      })
    )
  }),

  rest.get(`/api/v1/dictionary/search/empty`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        data: [],
      })
    )
  }),

  rest.get(`/api/v1/dictionary/search/error`, (req, res, ctx) => {
    return res(
      ctx.status(404),
      ctx.json({
        status: 404,
        message: 'Not Found',
      })
    )
  }),
];