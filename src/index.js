import Stream from 'stream';
import util from 'util';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

/**
 * is stream
 */
export function isStream(stream) {
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
export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
/**
 * is string
 */
export function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}
/**
 * is number
 */
export function isNumber(obj) {
  return Object.prototype.toString.call(obj) === '[object Number]';
}
/**
 * is true empty
 */
export function isTrueEmpty(obj) {
  if(obj === undefined || obj === null || obj === ''){
    return true;
  }
  if(isNumber(obj) && isNaN(obj)){
    return true;
  }
  return false;
}
/**
 * is empty
 */
export function isEmpty(obj) {
  if(isTrueEmpty(obj)){
    return true;
  }

  if (isObject(obj)) {
    for(let key in obj){
      return !key && !0;
    }
    return true;
  }else if (isArray(obj)) {
    return obj.length === 0;
  }else if (isString(obj)) {
    return obj.length === 0;
  }else if (isNumber(obj)) {
    return obj === 0;
  }else if (isBoolean(obj)) {
    return !obj;
  }
  return false;
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
  if (fs.accessSync) {
    try {
      fs.accessSync(dir, fs.R_OK);
      return true;
    } catch (e) {
      return false;
    }
  }
  return fs.existsSync(dir);
}

/**
 * check filepath is file
 */
export function isFile(filePath) {
  if (!isExist(filePath)) {
    return false;
  }
  let stat = fs.statSync(filePath);
  return stat.isFile();
}

/**
 * check path is directory
 */
export function isDirectory(filePath) {
  if (!isExist(filePath)) {
    return false;
  }
  let stat = fs.statSync(filePath);
  return stat.isDirectory();
}
/**
 * extend
 */
export function extend(target, ...sources) {
  let src, copy;
  if (!target) {
    target = isArray(sources[0]) ? [] : {};
  }
  sources.forEach(source => {
    if(!source){
      return;
    }
    for (let key in source) {
      src = target[key];
      copy = source[key];
      if (src && src === copy) {
        continue;
      }
      if (isObject(copy)) {
        target[key] = extend(src && isObject(src) ? src : {}, copy);
      } else if (isArray(copy)) {
        target[key] = extend([], copy);
      } else {
        target[key] = copy;
      }
    }
  });
  return target;
}

/**
 * get path files
 */
export function getFiles(dir, prefix = '') {
  if (!isExist(dir)) {
    return [];
  }
  if (isFile(dir)) {
    return [dir];
  }
  let files = fs.readdirSync(dir);
  let result = [];
  files.forEach(item => {
    let stat = fs.statSync(path.join(dir, item));
    if (stat.isFile()) {
      result.push(path.join(prefix, item));
    } else if (stat.isDirectory()) {
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
export function defer() {
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
export function md5(str) {
  return crypto.createHash('md5').update(str + '', 'utf8').digest('hex');
}

/**
 * async replace content
 */
export async function asyncReplace(content = '', replace, callback) {
  let match = [];
  content.replace(replace, (...args) => {
    match.push(args);
  });
  if (!match.length) {
    return content;
  }
  let promises = match.map(args => {
    return callback(...args);
  });
  let data = await Promise.all(promises);
  let result = '', prevIndex = 0;
  match.forEach((item, idx) => {
    let index = content.indexOf(item[0], prevIndex);
    result += content.substring(prevIndex, index) + data[idx];
    prevIndex = index + item[0].length;
  });
  result += content.substr(prevIndex);
  return result;
}
/**
 * check if is remote url
 */
export function isRemoteUrl(url) {
  if (!url) {
    return false;
  }
  url = url.toLowerCase();
  return url.indexOf('http://') === 0 || url.indexOf('https://') === 0 || url.indexOf('//') === 0;
}
/**
 * change mode
 */
export function chmod(dir, mode = '0777') {
  if (!isExist(dir)) {
    return false;
  }
  try {
    fs.chmodSync(dir, mode);
    return true;
  } catch (e) {
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
    try {
      fs.mkdirSync(dir, mode);
      return true;
    } catch (e) {
      return false;
    }
  }
  if (mkdir(pp, mode)) {
    return mkdir(dir, mode);
  } else {
    return false;
  }
}

/**
 * resource regexp
 */
export const ResourceRegExp = {
  background: /url\s*\(\s*([\'\"]?)([\w\-\/\.\@]+\.(?:png|jpg|gif|jpeg|ico|cur|webp|svg))(?:\?[^\?\'\"\)\s]*)?\1\s*\)/ig,
  font: /url\s*\(\s*([\'\"]?)([^\'\"\?]+\.(?:eot|woff2|woff|ttf|svg|otf))([^\s\)\'\"]*)\1\s*\)/ig,
  filter: /src\s*=\s*([\'\"])?([^\'\"]+\.(?:png|jpg|gif|jpeg|ico|cur|webp|svg))(?:\?[^\?\'\"\)\s]*)?\1\s*/ig,
  cdn: /\{\s*([\'\"]?)cdn\1\s*\:\s*([\'\"])([\w\/\-\.]+)\2\s*\}\.cdn/ig,
  inline: /\{\s*([\'\"]?)inline\1\s*\:\s*([\'\"])([\w\/\-\.]+)\2\s*\}\.inline/ig
};

/**
 * resource in tag attrs
 */
export const htmlTagResourceAttrs = {
  img: ['src', 'srcset'],
  script: ['src'],
  link: ['href'],
  param: ['value'],
  embed: ['src'],
  object: ['data'],
  source: ['src', 'srcset']
};

/**
 * background url mapper
 * construct from a string
 * can modify url for further changes
 */
export class BackgroundURLMapper {
  constructor(str) {
    this.orginalStr = str;
    ResourceRegExp.background.lastIndex = 0;
    let matches = ResourceRegExp.background.exec(str);
    this.url = matches && matches.length > 2 && matches[2];
    if (!this.url) {
      throw new TypeError('URLMapper: invalid url');
    }
    this.originalUrl = this.url;
    let pivot = str.indexOf(this.url);
    this.prev = str.slice(0, pivot);
    this.next = str.slice(pivot + this.url.length);
    this.type = /(png|jpg|gif|jpeg|ico|cur|webp|svg)$/.exec(this.url)[1];
  }
  reset() {
    this.url = this.originalUrl;
  }
  valueOf() {
    return this.prev + this.url + this.next;
  }
  isRemoteUrl() {
    return isRemoteUrl(this.url);
  }
}