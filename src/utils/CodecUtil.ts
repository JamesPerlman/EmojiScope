import { pipe } from 'fp-ts/function';
import { fold } from 'fp-ts/lib/Either';
import * as t from 'io-ts';

export class DecodeError extends Error {
  name = 'DecodeError';
}

export const CodecUtil = {
  // use promises to decode an io-ts model
  decode: <A, O = A, I = unknown>(type: t.Type<A, O, I>, data: I): Promise<A> => {
    return new Promise((resolve, reject) => pipe(type.decode(data), fold(reject, resolve)));
  },
};
