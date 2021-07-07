import * as t from 'io-ts';
import { Emoji } from '../../models';
import { CodecUtil } from '../../utils';
import { client } from '../client';

async function listAll(): Promise<Emoji[]> {
  const { data } = await client.get('/emojis');

  return CodecUtil.decode(t.array(Emoji), data);
}

export const emojis = {
  listAll,
};
