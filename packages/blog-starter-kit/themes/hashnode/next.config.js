const ANALYTICS_BASE_URL = 'https://hn-ping2.hashnode.com';
const HASHNODE_ADVANCED_ANALYTICS_URL = 'https://user-analytics.hashnode.com';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const GQL_ENDPOINT =
	process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT || 'https://gql-beta.hashnode.com';
const HASHNODE_API_KEY = process.env.HASHNODE_API_KEY;
const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST;
const MAX_REDIRECT_FETCH_ATTEMPTS = 3;

const getBasePath = () => {
	if (BASE_URL && BASE_URL.indexOf('/') !== -1) {
		return BASE_URL.substring(BASE_URL.indexOf('/'));
	}
	return undefined;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchRedirectionRules = async () => {
	const query = `
		query GetRedirectionRules($host: String!) {
			publication(host: $host) {
				id
				redirectionRules {
					source
					destination
					type
				}
			}
		}
  	`;

	const headers = {
		'Content-Type': 'application/json',
		'Accept-Encoding': 'identity',
	};

	if (HASHNODE_API_KEY) {
		headers.Authorization = HASHNODE_API_KEY;
	}

	const response = await fetch(GQL_ENDPOINT, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			query,
			variables: { host },
		}),
	});

	if (!response.ok) {
		throw new Error(`Hashnode redirects request failed with status ${response.status}`);
	}

	const { data, errors } = await response.json();

	if (errors?.length) {
		throw new Error(errors.map((error) => error.message).join('; '));
	}

	if (!data.publication) {
		throw new Error('Hashnode publication not found while fetching redirection rules.');
	}

	return data.publication.redirectionRules;
};

const getRedirectionRules = async () => {
	if (!host) {
		console.warn(
			'Skipping Hashnode redirection rules: NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST is not set.',
		);
		return [];
	}

	let redirectionRules = [];

	for (let attempt = 1; attempt <= MAX_REDIRECT_FETCH_ATTEMPTS; attempt += 1) {
		try {
			redirectionRules = await fetchRedirectionRules();
			break;
		} catch (error) {
			if (attempt === MAX_REDIRECT_FETCH_ATTEMPTS) {
				console.warn('Skipping Hashnode redirection rules after repeated failures.', error);
				return [];
			}

			await wait(300 * attempt);
		}
	}

	// convert to next.js redirects format
	const redirects = redirectionRules
		.filter((rule) => {
			// Hashnode gives an option to set a wildcard redirect,
			// but it doesn't work properly with Next.js
			// the solution is to filter out all the rules with wildcard and use static redirects for now
			return rule.source.indexOf('*') === -1;
		})
		.map((rule) => {
			return {
				source: rule.source,
				destination: rule.destination,
				permanent: rule.type === 'PERMANENT',
			};
		});

	return redirects;
};

/**
 * @type {import('next').NextConfig}
 */
const config = {
	transpilePackages: ['@starter-kit/utils'],
	basePath: getBasePath(),
	experimental: {
		scrollRestoration: true,
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.hashnode.com',
			},
		],
	},
	async rewrites() {
		return [
			{
				source: '/ping/data-event',
				destination: `${ANALYTICS_BASE_URL}/api/data-event`,
			},
			{
				source: '/api/analytics',
				destination: `${HASHNODE_ADVANCED_ANALYTICS_URL}/api/analytics`,
			},
		];
	},
	async redirects() {
		return await getRedirectionRules();
	},
};

module.exports = config;
