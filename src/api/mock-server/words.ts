import { rest } from 'msw';
import { MonthListData } from './data/month-list.data';
import { wordSearchResult } from './data/words-search.data';

export const mocksWords = [
  rest.get(`/api/v1/words/search/word`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        data: wordSearchResult,
      })
    )
  }),

  rest.get(`/api/v1/words/search/New%20Word`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        data: wordSearchResult,
      })
    )
  }),

  rest.get(`/api/v1/words/search/empty`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        data: [],
      })
    )
  }),

  rest.get(`/api/v1/words/search/error`, (req, res, ctx) => {
    return res(
      ctx.status(404),
      ctx.json({
        status: 404,
        message: 'Not Found',
      })
    )
  }),

  rest.get(`/api/v1/words/month-list`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        data: MonthListData,
      })
    )
  })
];