import { useState } from 'react';
import { twJoin } from 'tailwind-merge';

import ResponseReplyCard from './response-reply-card';

import { CommentNode } from './comment-types';
import Button from './hn-button';
import { CommentSVGV2 } from './icons/svgs';

interface Props {
	isPublicationPost: boolean;
	response: CommentNode;
	draftId?: string;
	isValidating?: boolean;
	depth?: number;
}

function ResponseFooter(props: Props) {
	const { isPublicationPost, response, draftId, isValidating = false, depth = 0 } = props;
	const replyEdges = response.replies?.edges ?? [];
	const fetchedReplyCount = replyEdges.length;
	const hasMoreReplies = response.replies?.pageInfo?.hasNextPage ?? false;
	const [repliesToShow, setRepliesToShow] = useState(1);
	const [hideShowAllBox, toggleShowAllBox] = useState(false);
	const showAllReplies = (e: any) => {
		e.preventDefault();
		setRepliesToShow(fetchedReplyCount);
		toggleShowAllBox(true);
	};

	const hideAllReplies = (e: any) => {
		e.preventDefault();
		setRepliesToShow(1);
		toggleShowAllBox(false);
	};

	const toggleAllReplies = (e: any) => {
		if (fetchedReplyCount > 1) {
			if (!hideShowAllBox) {
				showAllReplies(e);
			} else hideAllReplies(e);
		}
	};

	const replies = replyEdges.slice(-1 * repliesToShow).map((reply) => (
		<div key={reply.node.id}>
			<div className="my-1.5 ml-3.5 h-6 w-px border dark:border-slate-600" />
			<ResponseReplyCard
				draftId={draftId}
				isPublicationPost={isPublicationPost}
				key={reply.node.id}
				reply={reply.node}
				isValidating={isValidating}
			/>
			{(reply.node.replies?.edges.length ?? 0) > 0 && (
				<div className="ml-4 min-w-0 border-l border-slate-200 pl-4 dark:border-slate-700">
					<ResponseFooter
						depth={depth + 1}
						draftId={draftId}
						isPublicationPost={isPublicationPost}
						response={reply.node}
						isValidating={isValidating}
					/>
				</div>
			)}
		</div>
	));

	return (
		<div className="w-full">
			<div className="flex flex-row flex-nowrap items-center gap-4">
				{fetchedReplyCount > 0 && (
					<div className="flex items-center">
						<Button
							variant="transparent"
							onClick={toggleAllReplies}
							className="flex flex-row items-center rounded-full p-1 text-sm font-medium text-slate-600 hover:bg-slate-100 focus:outline-none dark:text-slate-200 dark:hover:bg-slate-800"
							aria-label="Reply to comment"
						>
							<CommentSVGV2 className="h-5 w-5 stroke-current" />
						</Button>
						<button
							type="button"
							onClick={toggleAllReplies}
							className={twJoin(
								'p-0 text-sm text-slate-500 focus:outline-none dark:text-slate-300',
								hideShowAllBox && 'hover:underline',
							)}
						>
							<span>{!hideShowAllBox ? fetchedReplyCount : 'Hide replies'}</span>
						</button>
					</div>
				)}
			</div>
			{fetchedReplyCount > 0 && (
				<div className="ml-3 min-w-0">
					{replies}
					{fetchedReplyCount > 1 && !hideShowAllBox && (
						<a
							href="#"
							onClick={showAllReplies}
							className="flex py-2 text-sm text-blue-500 hover:underline"
						>
							<span className="font-medium">
								Show more replies{hasMoreReplies ? ` (${fetchedReplyCount} shown)` : ''}
							</span>
						</a>
					)}
				</div>
			)}
		</div>
	);
}

export default ResponseFooter;
