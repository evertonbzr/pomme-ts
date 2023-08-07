import { FieldInputOptional } from './types';

export function isFieldInputOptional(input: any): input is FieldInputOptional {
  return (
    typeof input === 'object' &&
    input !== null &&
    ('body' in input || 'query' in input || 'params' in input)
  );
}
