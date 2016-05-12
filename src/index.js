import Stream from 'stream';

/**
 * is stream
 */
export function isStream(stream){
  return !!stream && stream instanceof Stream;
}

/**
 * is buffer
 */
export const isBuffer = Buffer.isBuffer;

/**
 * is array
 */
export const isArray = Array.isArray;

