import { DiscussionEmbed } from 'disqus-react';

type Props = {
	url: string;
	identifier: string;
	title: string;
};

const DisqusComments = ({ url, identifier, title }: Props) => {
	return (
		<div className="mx-auto w-full md:max-w-screen-md">
			<DiscussionEmbed
				shortname="x5gtrn-log"
				config={{
					url,
					identifier,
					title,
					language: 'en_US',
				}}
			/>
		</div>
	);
};

export default DisqusComments;
