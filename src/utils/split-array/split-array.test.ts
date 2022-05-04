import { splitArray } from "./split-array"

describe('splitArray', () => {
  it(`should return an empty array if the chunkSize parameter is equal to zero`, () => {
    expect(splitArray([1, 2, 3, 4, 5, 6], 0)).toEqual([])
  })

  it(`should return an empty array if the array parameter is an empty array`, () => {
    expect(splitArray([], 5)).toEqual([])
  })

  it(`should return an array with only one element if the chunkSize parameter is greater than or equal to array's size`, () => {
    expect(splitArray([1, 2, 3, 4], 5)).toEqual([[1, 2, 3, 4]])
    expect(splitArray([1, 2, 3, 4], 4)).toEqual([[1, 2, 3, 4]])
  })
  
  it(`should return an splitted array`, () => {
    expect(splitArray([1, 2, 3, 4, 5, 6], 2)).toEqual([[1, 2], [3, 4], [5, 6]]);
    expect(splitArray([1, 2, 3, 4, 5, 6, 7, 8], 3)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8]]);
  })
})