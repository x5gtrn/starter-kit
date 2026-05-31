import Link from 'next/link';
import { twJoin } from 'tailwind-merge';

export type PublicationTagCloudItem = {
	id: string;
	name: string;
	slug: string;
	count: number;
};

type Props = {
	tags: Array<PublicationTagCloudItem>;
};

function getTagSizeClass(count: number, maxCount: number) {
	if (maxCount <= 1) {
		return 'text-sm';
	}

	const weight = count / maxCount;

	if (weight >= 0.75) {
		return 'text-lg';
	}

	if (weight >= 0.45) {
		return 'text-base';
	}

	return 'text-sm';
}

function PublicationTagCloud(props: Props) {
	const tagCloudItems = props.tags;

	if (tagCloudItems.length === 0) {
		return null;
	}

	const maxTagCount = tagCloudItems[0]?.count || 1;

	return (
		<section className="blog-tag-cloud border-b border-slate-200 px-4 py-8 dark:border-slate-800">
			<div className="feed-width mx-auto md:w-2/3">
				<h2 className="font-heading mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
					Tags
				</h2>
				<div className="flex flex-wrap items-center gap-3">
					{tagCloudItems.map((tag) => (
						<Link
							key={tag.id}
							href={`/tag/${tag.slug}?source=tag_cloud_home`}
							className={twJoin(
								'font-heading rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 transition-colors hover:border-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-400 dark:focus:ring-offset-slate-900',
								getTagSizeClass(tag.count, maxTagCount),
							)}
						>
							<span>#{tag.name}</span>
							<span className="ml-1 text-xs font-medium text-slate-400 dark:text-slate-500">
								{tag.count}
							</span>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}

export default PublicationTagCloud;
