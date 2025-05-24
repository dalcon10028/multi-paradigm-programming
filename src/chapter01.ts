const DASH_LINE = '--------------------------------';

interface CustomIteratorYieldResult<T> {
  done?: false;
  value: T;
}

interface CustomIteratorReturnResult<T> {
  done: true;
  value: undefined;
}

interface CustomIterator<T> {
  next(
    value?: any
  ): CustomIteratorYieldResult<T> | CustomIteratorReturnResult<T>;
  return?(value?: any): CustomIteratorReturnResult<T>;
  throw?(e?: any): CustomIteratorReturnResult<T>;
}

class ArrayLikeIterator<T> implements Iterator<T> {
  private index = 0;
  constructor(private arrayLike: ArrayLike<T>) {}

  next(): IteratorResult<T> {
    if (this.index < this.arrayLike.length) {
      return { done: false, value: this.arrayLike[this.index++] };
    }
    return { done: true, value: undefined };
  }
}

function reverse<T>(arrayLike: ArrayLike<T>): Iterator<T> {
  let idx = arrayLike.length;
  return {
    next() {
      if (idx === 0) {
        return { done: true, value: undefined };
      }
      return { done: false, value: arrayLike[--idx] };
    },
  };
}

const array = ['a', 'b', 'c'];
const reversed = reverse(array);

console.log(reversed.next());
console.log(reversed.next());

console.log(DASH_LINE);

function map<A, B>(
  transform: (value: A) => B,
  iterator: Iterator<A>
): Iterator<B> {
  return {
    next(): IteratorResult<B> {
      const { done, value } = iterator.next();
      return done ? { done, value } : { done, value: transform(value) };
    },
  };
}

const array2 = ['a', 'b', 'c', 'd', 'e', 'f'];
const mapped = map((x) => x.toUpperCase(), reverse(array2));

console.log(mapped.next());
console.log(mapped.next());

console.log(DASH_LINE);

function* gen1() {
  yield 1;
  yield* [2, 3];
  yield 4;
}

const gen1Iterator = gen1();

console.log(gen1Iterator.next());
console.log(gen1Iterator.next());
console.log(gen1Iterator.next());
console.log(gen1Iterator.next());
console.log(gen1Iterator.next());

console.log(DASH_LINE);

function* reverse2<T>(iterator: ArrayLike<T>): IterableIterator<T> {
  for (let i = iterator.length - 1; i >= 0; i--) {
    yield iterator[i];
  }
}

const array3 = ['a', 'b', 'c', 'd', 'e', 'f'];
const reversed2 = reverse2(array3);

console.log(reversed2.next());
console.log(reversed2.next());
console.log(reversed2.next());

console.log(DASH_LINE);

function naturals(end = Infinity): IterableIterator<number> {
  let n = 1;

  return {
    next(): IteratorResult<number> {
      return n <= end
        ? { done: false, value: n++ }
        : { done: true, value: undefined };
    },
    [Symbol.iterator]() {
      return this;
    },
  };
}

const naturalsIterator = naturals(3);

for (const n of naturalsIterator) {
  console.log(n);
}

console.log(DASH_LINE);

function forEach<T>(f: (a: T) => void, iterable: Iterable<T>) {
  for (const a of iterable) {
    f(a);
  }
}

forEach(console.log, naturals(3));

console.log(DASH_LINE);

function* map2<A, B>(
  transform: (value: A) => B,
  iterable: Iterable<A>
): IterableIterator<B> {
  for (const a of iterable) {
    yield transform(a);
  }
}

const mapped2 = map2((x) => x * 2, naturals(3));
forEach(console.log, mapped2);

console.log(DASH_LINE);

function* filter<T>(
  predicate: (value: T) => boolean,
  iterable: Iterable<T>
): IterableIterator<T> {
  for (const a of iterable) {
    if (predicate(a)) {
      yield a;
    }
  }
}

const filtered = filter((x) => x % 2 === 0, naturals(10));
console.log([...filtered]);
