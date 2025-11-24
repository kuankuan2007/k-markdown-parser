import { tagStarterSelfReplaceName } from './options.js';
import { FullOption } from './types.js';

export function markdown2Inner(text: string, options: FullOption) {
  text = text.replaceAll('\r\n', '\n');
  text = text.replaceAll('\r', '\n');

  text = text.replace(
    options.replacerTagStart,
    `${options.replacerTagStart}${options.replacerTagMap[tagStarterSelfReplaceName]}`
  );
  text = text.replace(/\\\\/g, `${options.replacerTagStart}${options.replacerTagMap['\\']}`);
  for (const char in options.replacerTagMap) {
    if (char === '\\') continue;
    text = text.replace(
      new RegExp(`\\\\\\${char}`, 'g'),
      `${options.replacerTagStart}${options.replacerTagMap[char]}`
    );
  }
  text = text.replace('\\(.)', '$1');
  return text;
}
export function inner2Markdown(text: string, options: FullOption) {
  text = text.replace('\n', '\r\n');

  for (const char in options.replacerTagMap) {
    text = text.replace(
      new RegExp(`\\${options.replacerTagStart}\\${options.replacerTagMap[char]}`, 'g'),
      `\\${char}`
    );
  }
  text = text.replace(
    new RegExp(
      `\\${options.replacerTagStart}\\${options.replacerTagMap[tagStarterSelfReplaceName]}`,
      'g'
    ),
    options.replacerTagStart
  );
}

export function inner2Plant(text: string, options: FullOption) {
  text = text.replace('\n', '\r\n');

  for (const char in options.replacerTagMap) {
    text = text.replace(
      new RegExp(`\\${options.replacerTagStart}\\${options.replacerTagMap[char]}`, 'g'),
      char
    );
  }
  text = text.replace(
    new RegExp(
      `\\${options.replacerTagStart}\\${options.replacerTagMap[tagStarterSelfReplaceName]}`,
      'g'
    ),
    options.replacerTagStart
  );
  return text;
}
export function plantToInner(text: string, options: FullOption): string {
  text = text.replace('\r\n', '\n');
  text = text.replace('\r', '\n');
  for (const char in options.replacerTagMap) {
    text = text.replace(char, `${options.replacerTagStart}${options.replacerTagMap[char]}`);
  }
  text = text.replace(
    options.replacerTagStart,
    `${options.replacerTagStart}${options.replacerTagMap[tagStarterSelfReplaceName]}`
  );
  return text;
}
