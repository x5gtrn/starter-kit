import type { NextApiRequest, NextApiResponse } from 'next';

import { createHeaders } from '../../lib/api/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST');
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const endpoint = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;

	if (!endpoint) {
		return res.status(500).json({ error: 'Hashnode GraphQL endpoint is not configured' });
	}

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			...createHeaders(),
			'content-type': 'application/json',
		},
		body: JSON.stringify(req.body),
	});

	const contentType = response.headers.get('content-type');
	const body = contentType?.includes('application/json')
		? await response.json()
		: await response.text();

	if (contentType) {
		res.setHeader('content-type', contentType);
	}

	return res.status(response.status).send(body);
}
