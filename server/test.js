import { getCurrentDirectory, importFolder } from '#tools.js'
import { MsgPackEncoder } from 'json-joy/es6/json-pack/msgpack/MsgPackEncoder.js'
import { MsgPackDecoder } from 'json-joy/es6/json-pack/msgpack/MsgPackDecoder.js'
import { unpack, pack } from 'msgpackr'
import { encode, decode } from 'msgpack-lite'
import { encode as encode2, decode as decode2 } from 'tiny-msgpack'
import Benchmark from 'benchmark'

function sendNormalized (obj) {
	for (const key in obj) {
		if (typeof obj[key] === 'function') {
			obj[key] = '<F>' + obj[key].toString()
		} else if (obj[key] instanceof RegExp) {
			obj[key] = '<R>' + obj[key].toString()
		} else if (typeof obj[key] === 'object') {
			sendNormalized(obj[key])
		}
	}
	return obj
}

function sendNormalized2 (obj) {
	for (const key in obj) {
		const type = typeof obj[key]
		if (type === 'function') {
			obj[key] = '￯F' + obj[key]
		} else if (type === 'object') {
			if (obj[key] instanceof RegExp) {
				obj[key] = '￯F' + obj[key]
			} else {
				sendNormalized2(obj[key])
			}
		}
	}
	return obj
}

const a = {
	reg: /[a-z]/,
	numb: 12,
	str: 'String',
	bool: true,
	func: (a) => a ** 2,
	arr: [1, 2, 3, 4],
	test: { a: 1, b2: 22, reg: /a-z/, f2: (a) => a * 4 },
}
const m = new MsgPackEncoder()
const d = new MsgPackDecoder()

const suite = new Benchmark.Suite

suite.add('variant #2', function () {
	return sendNormalized2(a)
})
suite.add('variant #1', function () {
	return sendNormalized(a)
})
suite
.on('cycle', function (event) {
	console.log(String(event.target))
})
.on('complete', function () {
	console.log('Fastest is ' + this.filter('fastest').map('name'))
})
.run({ 'async': true })

/*
//JSON
suite.add('JSON en', function () {
 return JSON.stringify(a);
})

let b1 = JSON.stringify(a);
//console.log('JSON', b1);

suite.add('JSON de', function () {
	return JSON.parse(b1);
})

//console.log('JSON', JSON.parse(b1));

//MSGP
suite.add('msgpackr en', function () {
	return pack(a);
})
let b2 = pack(a);
//console.log('msgpackr', b2);
suite.add('msgpackr de', function () {
	return unpack(b2);
})
//console.log('msgpackr', unpack(b2));


suite.add('msg lite en', function () {
	return encode(a);
})
let b3 = encode(a)
//console.log('msg lite', b3);
suite.add('msg lite de', function () {
	return decode(b3);
})
//console.log('msg lite', decode(b3));


suite.add('joi en', function () {
	return m.encode(a);
})

let b5 = m.encode(a)
console.log('joy', b5);
suite.add('joi de', function () {
	return d.read(b5);
})
console.log('joi', d.read(b5));

suite.add('joix en', function () {
	return m.encode(sendNormalized(a));
})

console.log('joix', m.encode(sendNormalized(a)));
suite
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    .on('complete', function() {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({ 'async': true });

*/
