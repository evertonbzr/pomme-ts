import { blue, red, yellow } from 'kleur/colors';

export const tags = {
  error: red('pomme:error'),
  warn: yellow('pomme:warn'),
  info: blue('pomme:info'),
};
export const should = {
  warn: () => !process.env.POMME_DISABLE_WARNINGS,
};
export function log(...data: any[]) {
  console.log(...data);
}

export function warn(message: any, ...optionalParams: any[]) {
  if (should.warn()) {
    console.warn(`${tags.warn} ${message}`, ...optionalParams);
  }
}
export function info(message: any, ...optionalParams: any[]) {
  console.info(`${tags.info} ${message}`, ...optionalParams);
}
export function error(message: any, ...optionalParams: any[]) {
  console.error(`${tags.error} ${message}`, ...optionalParams);
}
