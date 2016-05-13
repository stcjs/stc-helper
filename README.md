# stc-helper

helper for stc

## How to use

```js
import {isFile} from 'stc-helper';
if(isFile('xxx')){
	
}
```

## API

### isStream(stream)

check is stream.

```js
import {isStream} from 'stc-helper';
if(isStream(stream){
	
}
```

### isBuffer(buffer)

check is buffer.

### isArray(arr)

check is array.

### isFunction(fn)

check is function.

### isRegExp(regexp)

check is RegExp.

### isExist(filePath)

check file/dir is exist.

### getFiles(dir, prefix = '')

get files from dir.

```js
import {getFiles} from 'stc-helper';

let files = getFiles('/path/to'); // return is array

```

### promisify(fn, receiver)

make callback function to promise.

```js
import {promisify} from 'stc-helper';
import fs from 'fs'

let fn = promisify(fs.readFile, fs);
fn('/path/to/file', 'utf8').then(content => {
	
})
```

### defer()

get Deferred object.

```js
import {defer} from 'stc-helper';

let fn => {
	let deferred = defer();
	if(xxx){
		deferred.resolve('xxx');
	}else{
		deferred.reject(new Error());
	}
	return deferred.promise;
}

```

### md5(str)

get content md5 value.

### asyncReplace(content, replace, callback)

async content replace

```js
import {asyncReplace} from 'stc-helper';

let fn = async content => {
	return asyncReplace(content, /\d+/, (a, b) => {
		return Promise.resolve(a);
	});
}
```