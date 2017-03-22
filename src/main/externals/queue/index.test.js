import { extractSubTree } from './index';

describe('extractSubTree', () => {
  it('should trim shallow primitive values', () => {
    const target = {
      a: 'a',
      b: 'b'
    };
    const source = {
      a: 'a',
      b: 'b',
      c: 'c',
      d: 'd'
    };
    expect(extractSubTree(source, target)).toEqual({
      a: 'a',
      b: 'b'
    });
  });

  it('should trim nested objects', () => {
    const target = {
      a: 'a',
      nested: {
        a: 'a'
      }
    };
    const source = {
      a: 'a',
      nested: {
        a: 'a',
        b: 'b'
      }
    };
    expect(extractSubTree(source, target, {})).toEqual({
      a: 'a',
      nested: {
        a: 'a'
      }
    });
  });

  it('should copy arrays', () => {
    const target = {
      a: 'a',
      array: ['a', 'b']
    };
    const source = {
      a: 'a',
      array: ['a', 'b', 'c']
    };
    expect(extractSubTree(source, target, {})).toEqual({
      a: 'a',
      array: ['a', 'b', 'c']
    });
  });

  it('should skip target objects not reflected in source', () => {
    const target = {
      a: 'a',
      obj: {
        a: 'a'
      }
    };
    const source = {
      a: 'a',
      b: ''
    };
    expect(extractSubTree(source, target, {})).toEqual({
      a: 'a'
    });
  });
});
