import * as t from 'io-ts';

const EmojiModel = t.type({
  slug: t.string,
  character: t.string,
  unicodeName: t.string,
  codePoint: t.string,
  group: t.string,
  subGroup: t.string,
});

// t.exact strips extra keys that aren't defined in the t.type model definition above
export const Emoji = t.exact(EmojiModel);

// overloading the name of the model with a matching type allows us to write terse code which is more semantically flexible and pretty
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Emoji = t.TypeOf<typeof Emoji>;
