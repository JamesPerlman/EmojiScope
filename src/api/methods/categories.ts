import * as t from 'io-ts';
import { Category } from '../../models';
import { CodecUtil } from '../../utils';
import { client } from '../client';

async function listAll(): Promise<Category[]> {
  const { data } = await client.get('/categories');

  return CodecUtil.decode(t.array(Category), data);
}

export const categories = {
  listAll,
};
