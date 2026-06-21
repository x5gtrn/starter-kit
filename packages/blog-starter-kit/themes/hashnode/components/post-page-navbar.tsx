import { forwardRef } from 'react';
import { twJoin } from 'tailwind-merge';

import HeaderBlogSearch from './header-blog-search';
import HeaderLeftSidebar from './header-left-sidebar';
import PublicationSocialLinks from './publication-social-links';
import useStickyNavScroll from './use-sticky-nav-scroll';

import { PublicationFragment } from '../generated/graphql';
import PublicationLogo from './publication-logo';

type Props = {
	publication: Pick<PublicationFragment, 'id' | 'title' | 'links' | 'url' | 'features' | 'isTeam' | 'author' | 'preferences'>;
};

const PostPageNavbar = forwardRef<HTMLElement, Props>((props, ref) => {
	const { publication } = props;

	useStickyNavScroll({ elRef: ref });

	return (
		<div className="container mx-auto px-2 md:px-4 2xl:px-10">
			<div className="relative z-40 flex flex-row items-center justify-between pb-2 pt-8 md:mb-4">
				<div
					className={twJoin(
						'flex flex-row items-center py-1','dark:text-white',
					)}
				>
					<div className="hidden md:block">
						<PublicationLogo publication={publication} size="lg" withProfileImage isPostPage />
					</div>
				</div>

				<div
					className={twJoin(
						'flex flex-row items-center py-1','dark:text-white',
					)}
				>
					<HeaderLeftSidebar publication={publication} />
					<HeaderBlogSearch publication={publication} />
				</div>
			</div>

			{/* Logo for mobile view */}
			<div className="mx-auto my-5 flex w-2/3 flex-row items-center justify-center md:hidden">
				<PublicationLogo publication={publication} size="xl" isPostPage />
			</div>

			<div className="blog-sub-header mb-4 md:hidden" data-testid="blog-sub-header">
				{/* Social Links for mobile view */}
				<div className="mt-6">
					<PublicationSocialLinks links={publication.links} />
				</div>
			</div>
		</div>
	);
});

PostPageNavbar.displayName = 'PostPageNavbar';

export default PostPageNavbar;
