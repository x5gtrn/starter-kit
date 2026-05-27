const { request, gql } = require('graphql-request');

const ANALYTICS_BASE_URL = 'https://hn-ping2.hashnode.com';
const HASHNODE_ADVANCED_ANALYTICS_URL = 'https://user-analytics.hashnode.com';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;
const HASHNODE_API_KEY = process.env.HASHNODE_API_KEY;
const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST;

const getBasePath = () => {
	if (BASE_URL && BASE_URL.indexOf('/') !== -1) {
		return BASE_URL.substring(BASE_URL.indexOf('/'));
	}
	return undefined;
};

const getValidRedirectionRule = (rule) => {
	if (!rule.source || !rule.destination || rule.source.indexOf('*') !== -1) {
		return null;
	}

	const source = rule.source.startsWith('/') ? rule.source : `/${rule.source}`;
	const destination =
		rule.destination.startsWith('/') || /^https?:\/\//.test(rule.destination)
			? rule.destination
			: `/${rule.destination}`;

	return {
		source,
		destination,
		permanent: rule.type === 'PERMANENT',
	};
};

const getHashnodeRequestHeaders = () => {
	return HASHNODE_API_KEY ? { Authorization: HASHNODE_API_KEY } : undefined;
};

const getRedirectionRules = async () => {
	const query = gql`
		query GetRedirectionRules {
			publication(host: "${host}") {
				id
				redirectionRules {
					source
					destination
					type
				}
			}
		}
  	`;

	let data;

	try {
		data = await request(GQL_ENDPOINT, query, undefined, getHashnodeRequestHeaders());
	} catch (error) {
		console.warn('Failed to fetch Hashnode redirection rules; skipping redirects.', error);
		return [];
	}

	if (!data.publication) {
		console.warn(
			'Publication not found while fetching redirection rules. Please verify NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST.',
		);
		return [];
	}

	const redirectionRules = data.publication.redirectionRules;

	// convert to next.js redirects format
	const redirects = redirectionRules.map(getValidRedirectionRule).filter(Boolean);

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
