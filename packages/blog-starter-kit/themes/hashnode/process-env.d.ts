declare namespace NodeJS {
	interface ProcessEnv {
		[key: string]: string | undefined;
		HASHNODE_API_KEY?: string;
		NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT: string;
		NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST: string;
		NEXT_PUBLIC_GA_TRACKING_ID?: string;
		NEXT_PUBLIC_OPENPANEL_CLIENT_ID?: string;
		NEXT_PUBLIC_OPENPANEL_API_URL?: string;
		// add more environment variables and their types here
	}
}
