
import { loadData, handleLoadingErrors } from "./load-data";

describe('loadData', () => {
  it(`should throw an error if the response's data is undefined`, () => {
    const res = {
      status: 404,
      data: undefined,
      message: 'Not found',
    };

    expect(() => loadData(res, () => {}, () => {})).toThrowError('Not found');
  });

  it(`should run the processData function if it is defined`, () => {
    const res = {
      status: 200,
      data: [1, 2, 3, 4, 5],
      message: '',
    };

    const processData = jest.fn((data: number[]) => data.filter(n => n % 2 === 0));

    loadData(res, () => {}, () => {}, processData);

    expect(processData).toHaveBeenCalledWith([1, 2, 3, 4, 5]);
  });

  it(`should throw an error if the cannotBeEmpty parameter is true and the response's data is an empty array`, () => {
    const res = {
      status: 200,
      data: [],
      message: '',
    };

    expect(() => loadData(res, () => {}, () => {}, undefined, true)).toThrowError('The response array cannot be empty');
  });


  it(`should throw an error if the cannotBeEmpty parameter is true and the response's data is an empty array as a result of the processing function`, () => {
    const res = {
      status: 200,
      data: [1, 2, 3, 4, 5],
      message: '',
    };

    const processData = (data: number[]) => data.filter(n => n > 10);

    expect(() => loadData(res, () => {}, () => {}, processData, true)).toThrowError('The response array cannot be empty');
  });

  it(`should set the 'success' state and load the data if the response's data is not an empty array`, () => {
    const res = {
      status: 200,
      data: [1, 2, 3, 4, 5],
      message: '',
    };

    const setData = jest.fn();
    const setState = jest.fn();

    loadData(res, setData, setState);

    expect(setData).toHaveBeenCalledWith([1, 2, 3, 4, 5]);
    expect(setState).toHaveBeenCalledWith({
      state: 'success',
      message: '',
    });
  });

  it(`should set the 'success' state and load the data if the response's data is not an empty array as a result of the processing function`, () => {
    const res = {
      status: 200,
      data: [1, 2, 3, 4, 5],
      message: '',
    };

    const setData = jest.fn();
    const setState = jest.fn();

    const processData = (data: number[]) => data.filter(n => n % 2 === 0);

    loadData(res, setData, setState, processData);

    expect(setData).toHaveBeenCalledWith([2, 4]);
    expect(setState).toHaveBeenCalledWith({
      state: 'success',
      message: '',
    });
  });

  it(`should set the 'empty' state if the response's data is an empty array`, () => {
    const res = {
      status: 200,
      data: [],
      message: '',
    };

    const setData = jest.fn();
    const setState = jest.fn();

    loadData(res, setData, setState);

    expect(setData).toHaveBeenCalledWith([]);
    expect(setState).toHaveBeenCalledWith({
      state: 'empty',
      message: 'Wow such empty :(',
    });
  });

  it(`should set the 'empty' state with an custom message`, () => {
    const res = {
      status: 200,
      data: [],
      message: '',
    };

    const setData = jest.fn();
    const setState = jest.fn();

    loadData(res, setData, setState, undefined, undefined, 'Before you start, please add some numbers to the list');

    expect(setData).toHaveBeenCalledWith([]);
    expect(setState).toHaveBeenCalledWith({
      state: 'empty',
      message: 'Before you start, please add some numbers to the list',
    });
  });
});

describe('handleLoadingErrors', () => {
  it(`should set the 'error' state`, () => {
    const setState = jest.fn();

    handleLoadingErrors('Not found', setState);

    expect(setState).toHaveBeenCalledWith({
      state: 'error',
      message: 'There was an error. Please try again',
    });
  });

  it(`should set the 'error' state with an custom message`, () => {
    const setState = jest.fn();

    handleLoadingErrors('Not found', setState, 'Something went wrong');

    expect(setState).toHaveBeenCalledWith({
      state: 'error',
      message: 'Something went wrong',
    });
  });

  it(`shouldn't set the 'error' state if the error message is 'canceled'`, () => {
    const setState = jest.fn();

    handleLoadingErrors('canceled', setState);

    expect(setState).not.toHaveBeenCalled();
  });

  it(`shouldn't set the 'error' state if the error message is 'Error: canceled'`, () => {
    const setState = jest.fn();

    handleLoadingErrors('Error: canceled', setState);

    expect(setState).not.toHaveBeenCalled();
  });
});