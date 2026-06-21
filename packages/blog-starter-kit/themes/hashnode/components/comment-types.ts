export type CommentAuthor = {
	id: string;
	name: string;
	username: string;
	profilePicture?: string | null;
};

export type CommentNode = {
	id: string;
	dateAdded: string;
	totalReactions: number;
	content: {
		html: string;
		markdown: string;
	};
	author: CommentAuthor;
	replies?: CommentConnection;
};

export type CommentConnection = {
	edges: Array<{
		node: CommentNode;
	}>;
	pageInfo?: {
		hasNextPage?: boolean | null;
		endCursor?: string | null;
	};
};
