import * as t from 'io-ts';

const CategoryModel = t.type({
  slug: t.string,
  subCategories: t.array(t.string),
});

export const Category = t.exact(CategoryModel);

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Category = t.TypeOf<typeof Category>;
