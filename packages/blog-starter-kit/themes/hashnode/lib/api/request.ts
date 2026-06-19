import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { GraphQLClient, RequestDocument, Variables } from 'graphql-request';
import { HASHNODE_GQL_ENDPOINT, createHeaders } from './client';

const MAX_ATTEMPTS = 3;

function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function requestHashnode<TData, TVariables extends Variables = Variables>(
	document: RequestDocument | TypedDocumentNode<TData, TVariables>,
	variables?: TVariables,
): Promise<TData> {
	let lastError: unknown;

	for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
		try {
			const client = new GraphQLClient(HASHNODE_GQL_ENDPOINT, {
				fetch,
				headers: {
					...createHeaders(),
					'Accept-Encoding': 'identity',
				},
			});

			return (await (client.request as any)(document, variables)) as TData;
		} catch (error) {
			lastError = error;

			if (attempt < MAX_ATTEMPTS) {
				await wait(300 * attempt);
			}
		}
	}

	throw lastError;
}
