import { assertNonNull } from './assert-non-null';

describe('.assertNonNull(x)', () => {
  it('throws in case the passed value is `null`', () => {
    expect(() => assertNonNull(null)).toThrow();
  });

  it('does not throw if the value is not `null`', () => {
    expect(() => assertNonNull({})).not.toThrow();
  });

  it('does not throw if the value is false', () => {
    expect(() => assertNonNull(false)).not.toThrow();
  });

  it('does not throw if the value is empty array', () => {
    expect(() => assertNonNull([])).not.toThrow();
  });
});
