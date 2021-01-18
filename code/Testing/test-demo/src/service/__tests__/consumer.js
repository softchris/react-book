import data from '../consumer';
jest.mock('../repository');

describe('testing consumer data', () => {
  it('should return 2 items', () => {
    console.log(data);
    expect(data.length).toBe(2);
  });
});
