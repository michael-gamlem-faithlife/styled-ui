/* eslint-env mocha */
import expect from '@types/expect/index.d.ts';
import { isValidDomain } from '../domains';

describe('domains', () => {
	describe('isValidDomain', () => {
		const valid = [
			'faithlife.com',
			'mail.logos.com',
			'sub.domain.fake-tld',
			'www.google.com',
			'UPPERCASE.ORG',
			'ends-with-number-1.com1',
			'1-starts-with-number.1com',
		];

		for (const domain of valid) {
			it(`accepts "${domain}"`, () => {
				expect(isValidDomain(domain)).toEqual(true);
			});
		}

		const invalid = [
			'faithlife',
			'devtest01',
			'non-alphanumeric!@#$%.com',
			'-starts-with-dash.com',
			'ends-with-dash-.com',
			'reallyloooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong.com',
			'has space.net',
		];

		for (const domain of invalid) {
			it(`rejects "${domain}"`, () => {
				expect(isValidDomain(domain)).toEqual(false);
			});
		}
	});
});
