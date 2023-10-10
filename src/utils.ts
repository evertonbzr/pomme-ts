function toSnakeCase(inputString: string) {
  const snakeCaseString = inputString.replace(/[\W_]+/g, '_');
  return snakeCaseString.replace(/^_+|_+$/g, '').toLowerCase();
}

export const getConstName = (path: string) => {
  const pathArr = path.split('/').filter(Boolean);
  return toSnakeCase(pathArr.join('_'));
};
