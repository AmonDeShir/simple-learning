import { rest } from 'msw';
import { progressData } from './data/progress.data';
import { setData } from './data/set.data';
import { setSearchData } from './data/sets-search.data';
import { setsData } from './data/sets.data';

const searchItems = {
  sets: [ ...setSearchData.sets ],
  userWords: { ...setSearchData.userWords },
}

export const mocksSets = [
  rest.get('/api/v1/sets/progress', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        data: progressData,
      })
    )
  }),

  rest.get('/api/v1/sets', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        data: setsData,
      })
    )
  }),

  rest.get(`/api/v1/sets/0102`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        data: setData,
      })
    )
  }),

  rest.get(`/api/v1/sets/set_id_0`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        data: setData,
      })
    )
  }),


  rest.get(`/api/v1/sets/error`, (req, res, ctx) => {
    return res(
      ctx.status(404),
      ctx.json({
        status: 404,
        message: 'Not Found',
      })
    )
  }),

  rest.get(`/api/v1/sets/empty`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        data: {
          "id": "empty",
          "title": "Empty Set",
          "progress": {
            "learning": 0,
            "relearning": 0,
            "graduated": 0
          },
          words: []
        },
      })
    )
  }),


  rest.get(`/api/v1/sets/search`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        data: searchItems,
      })
    )
  }),

  rest.get(`/api/v1/sets/search/word`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        data: searchItems,
      })
    )
  }),

  rest.get(`/api/v1/sets/search/empty`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        data: {
          'sets': [],
          'userWords': undefined,
        },
      })
    )
  }),

  rest.get(`/api/v1/sets/search/error`, (req, res, ctx) => {
    return res(
      ctx.status(404),
      ctx.json({
        status: 404,
        message: 'Not Found',
        data: undefined,
      })
    )
  }),

  rest.delete(`/api/v1/sets/set_id_0`, (req, res, ctx) => {
    searchItems.sets = searchItems.sets.filter(item => item.id !== 'set_id_0')

    return res(
      ctx.status(404),
      ctx.json({
        status: 404,
        message: 'success'
      })
    )
  }),

  rest.post(`/api/v1/sets`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        status: 201,
        message: 'success'
      })
    )
  }),

  rest.get(`/api/v1/sets/restoreSearchData`, (req, res, ctx) => {
    searchItems.sets = [ ...setSearchData.sets ]
    searchItems.userWords = { ...setSearchData.userWords }

    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        message: 'success'
      })
    )
  })
];