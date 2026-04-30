import { useEffect } from 'react';

declare global {
	interface Window {
		disqus_config: (this: { page: { url: string; identifier: string; title: string }; language: string }) => void;
		DISQUS?: {
			reset: (opts: { reload?: boolean; config?: () => void }) => void;
		};
	}
}

type Props = {
	url: string;
	identifier: string;
	title: string;
};

const DisqusComments = ({ url, identifier, title }: Props) => {
	useEffect(() => {
		window.disqus_config = function () {
			this.page.url = url;
			this.page.identifier = identifier;
			this.page.title = title;
			this.language = 'en_US';
		};

		if (window.DISQUS) {
			window.DISQUS.reset({ reload: true, config: window.disqus_config });
		} else {
			const script = document.createElement('script');
			script.src = 'https://x5gtrn-log.disqus.com/embed.js';
			script.async = true;
			script.setAttribute('data-timestamp', String(+new Date()));
			document.body.appendChild(script);
		}
	}, [url, identifier, title]);

	return <div id="disqus_thread" className="mx-auto mt-[100px] w-full md:max-w-screen-md" />;
};

export default DisqusComments;
