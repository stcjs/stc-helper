import Stream from 'stream';
import util from 'util';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

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

/**
 * is function
 */
export function isFunction(obj) {
  return typeof obj === 'function';
}
/**
 * is object
 */
export function isObject(obj){
  return Object.prototype.toString.call(obj) === '[object Object]';
}
/**
 * is string
 */
export function isString(obj){
  return Object.prototype.toString.call(obj) === '[object String]';
}
/**
 * is regexp
 */
export const isRegExp = util.isRegExp;

/**
 * check path is exist
 */
export function isExist(dir) {
  dir = path.normalize(dir);
  if(fs.accessSync){
    try{
      fs.accessSync(dir, fs.R_OK);
      return true;
    }catch(e){
      return false;
    }
  }
  return fs.existsSync(dir);
}

/**
 * check filepath is file
 */
export function isFile(filePath){
  if(!isExist(filePath)){
    return false;
  }
  let stat = fs.statSync(filePath);
  return stat.isFile();
}

/**
 * check path is directory
 */
export function isDirectory(filePath){
  if(!isExist(filePath)){
    return false;
  }
  let stat = fs.statSync(filePath);
  return stat.isDirectory();
}
/**
 * extend
 */
export function extend(target, source){
  let src, copy;
  if(!target){
    target = isArray(source) ? [] : {};
  }
  if(!source){
    return target;
  }
  for(let key in source){
    src = target[key];
    copy = source[key];
    if(src && src === copy){
      continue;
    }
    if(isObject(copy)){
      target[key] = extend(src && isObject(src) ? src : {}, copy);
    }else if(isArray(copy)){
      target[key] = extend([], copy);
    }else{
      target[key] = copy;
    }
  }
  return target;
}

/**
 * get path files
 */
export function getFiles(dir, prefix = ''){
  if(!isExist(dir)){
    return [];
  }
  if(isFile(dir)){
    return [dir];
  }
  let files = fs.readdirSync(dir);
  let result = [];
  files.forEach(item => {
    let stat = fs.statSync(path.join(dir, item));
    if (stat.isFile()) {
      result.push(path.join(prefix, item));
    }else if(stat.isDirectory()){
      let cFiles = getFiles(path.join(dir, item), path.join(prefix, item));
      result = result.concat(cFiles);
    }
  });
  return result;
}

/**
 * make callback to promise
 */
export function promisify(fn, receiver) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn.apply(receiver, [...args, (err, res) => {
        return err ? reject(err) : resolve(res);
      }]);
    });
  };
}

/**
 * defer
 */
export function defer(){
  let deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
}

/**
 * md5
 */
export function md5(str){
  return crypto.createHash('md5').update(str + '', 'utf8').digest('hex');
}

/**
 * async replace content
 */
export async function asyncReplace(content = '', replace, callback){
  let match = content.match(replace);
  if(!match){
    return content;
  }
  let promises = match.map(args => {
    return callback(...args);
  });
  let data = await Promise.all(promises);
  let result = '', prevIndex = 0;
  match.forEach((item, idx) => {
    let index = content.indexOf(item);
    result += content.substr(prevIndex, index) + data[idx];
    prevIndex += item.length;
  });
  result += content.substr(prevIndex);
  return result;
}
/**
 * check if is remote url
 */
export function isRemoteUrl(url){
  url = url.toLowerCase();
  return url.indexOf('http://') === 0 || url.indexOf('https://') === 0 || url.indexOf('//') === 0;
}
/**
 * change mode
 */
export function chmod(dir, mode = '0777'){
  if(!isExist(dir)){
    return false;
  }
  try{
    fs.chmodSync(dir, mode);
    return true;
  }catch(e){
    return false;
  }
}
/**
 * make dir
 */
export function mkdir(dir, mode = '0777') {
  if (isExist(dir)) {
    return chmod(dir, mode);
  }
  let pp = path.dirname(dir);
  if (isExist(pp)) {
    try{
      fs.mkdirSync(dir, mode);
      return true;
    }catch(e){
      return false;
    }
  }
  if(mkdir(pp, mode)){
    return mkdir(dir, mode);
  }else{
    return false;
  }
}