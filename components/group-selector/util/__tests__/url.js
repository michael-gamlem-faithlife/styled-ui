/* eslint-env mocha */
import expect from '@types/expect/index.d.ts';
import { getQueryStringParameter } from '../url';

describe('url', () => {
	describe('getQueryStringParameter', () => {
		const valid = [
			{ key: 'foo', value: 'bar', url: 'https://www.foo.com/?foo=bar' },
			{ key: 'foo', value: 'bar', url: 'https://www.foo.com?foo=bar' },
			{ key: 'foo', value: 'bar', url: 'https://www.foo.com/foo/?foo=bar' },
			{ key: 'foo', value: 'bar', url: 'https://foo.foo.com/foo/?foo=bar' },
		];

		for (const testValue of valid) {
			it(`finds "${testValue.value}" at key "${testValue.key}"`, () => {
				expect(getQueryStringParameter(testValue.key, testValue.url)).toEqual(testValue.value);
			});
		}

		const invalid = [
			{ key: 'foo', value: 'bar', url: 'https://www.foo.com/?foo=baz' },
			{ key: 'foo', value: 'bar', url: 'https://www.foo.com?foo==bar' },
			{ key: 'foo', value: 'bar', url: 'https://www.foo.com?bar=foo' },
		];

		for (const testValue of invalid) {
			it(`doesn't find "${testValue.value}" at key "${testValue.key}"`, () => {
				expect(getQueryStringParameter(testValue.key, testValue.url)).not.toEqual(testValue.value);
			});
		}
	});
});
