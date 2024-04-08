import { loadAdvancedData } from "./load-advanced-data";
import * as loadData from './load-data';

type TestData = {
  array: number[];
  id: string
}

describe('loadAdvancedData', () => {
  let loadDataSpy: jest.SpyInstance;
  const origin = loadData.loadData;

  beforeAll(() => {
    loadDataSpy = jest.spyOn(loadData, 'loadData');
  });

  beforeEach(() => {
    loadDataSpy.mockClear();
    loadDataSpy.mockImplementation(origin);
  });

  afterAll(() => {
    loadDataSpy.mockRestore();
  });

  it(`should throw an error if the response's data is undefined`, () => {
    const res = {
      status: 404,
      data: undefined,
      message: 'Not found',
    };

    expect(() => loadAdvancedData(res, () => [], () => {}, () => {}, () => {})).toThrowError('Not found');
  });

  it(`should call the loadData function with with the unpacked response's data`, () => {
    const res = {
      status: 200,
      data: {
        array: [1, 2, 3, 4, 5],
        id: '101',
      },
      message: '',
    };
    
    const unpack = (data: TestData) => data.array;
    const pack = (array: number[], data: TestData) => ({ ...data, array });
    const setProgress = () => {};
    const processData = (data: any) => data;


    loadAdvancedData(res, unpack, pack, () => {}, setProgress, processData, false, 'message');

    expect(loadDataSpy).toHaveBeenCalledWith(
      {
        status: 200,
        data: [1, 2, 3, 4, 5],
        message: '',
      },
      expect.any(Function),
      setProgress,
      processData,
      false,
      'message',
    );
  });

  it(`should pack the loadData function response`, () => {
    const res = {
      status: 200,
      data: {
        array: [1, 2, 3, 4, 5],
        id: '101',
      },
      message: '',
    };
    
    const unpack = (data: TestData) => data.array;
    const pack = (array: number[], data: TestData) => ({ ...data, array });
    const setData = jest.fn();
    const setProgress = () => {};


    loadAdvancedData(res, unpack, pack, setData, setProgress);

    expect(loadDataSpy).toHaveBeenCalledWith(
      {
        status: 200,
        data: [1, 2, 3, 4, 5],
        message: '',
      },
      expect.any(Function),
      setProgress,
      undefined,
      undefined,
      undefined,
    );

    expect(setData).toHaveBeenCalledWith({
      array: [1, 2, 3, 4, 5],
      id: '101',
    });
  });
})