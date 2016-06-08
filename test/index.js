import test from 'ava';
import {extend, asyncReplace} from '../lib/index.js';

test('extend 1', t => {
  let data = extend({}, {name: 'test'});
  t.deepEqual(data, {name: 'test'});
});

test('extend 2', t => {
  let data = extend({
    name: 'xd'
  }, {name: ['1', '2']});
  t.deepEqual(data, {name: ['1', '2']});
});

test('extend 3', t => {
  let data = extend({
    name: 'xd'
  }, {name: {value: '1'}});
  t.deepEqual(data, {name: {value: '1'}});
});


test('asyncReplace', async (t) => {
  let content = 'abca';
  let data = await asyncReplace(content, /(a)/g, a => {
    return Promise.resolve('1');
  })
  t.is(data, '1bc1');
});

test('asyncReplace', async (t) => {
  let content = 'welefen+{stc:"/static/js/1.js"}.stc+{stc:"/static/js/2.js"}.stc';
  let data = await asyncReplace(content, /(\{\s*[\'\"]?stc[\'\"]?\s*\:[^{}]+(\/(js)\/[^\{\}]+\.(?:\w+))[\'\"]*\s*\}\.stc)/ig, (...args) => {
    if(args[2] === '/js/2.js'){
      return Promise.resolve('222');
    }
    return Promise.resolve('111');
  })
  t.is(data, 'welefen+111+222');
});