import data from '../repository';
jest.mock('../repository');

describe('testing repository data', () => {
  it('should return 1 item', () => {
    console.log(data);
    expect(data.length).toBe(1);
  });
});
