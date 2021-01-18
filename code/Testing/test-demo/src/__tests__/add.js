import add from '../add';

describe('add', () => {
  it('testing addition', () => {
    const actual = add(1,2);
    expect(actual).toBe(3);
  })

  it('testing addition with neg number', () => {
    expect(() => {
      add(-1,2);
    }).toThrow('parameters must be larger than zero');
  })
})
