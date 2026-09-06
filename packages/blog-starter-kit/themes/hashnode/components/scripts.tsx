const HASHNODE_GA_TRACKING_ID = 'G-72XG3F8LNJ'; // This is Hashnode's GA tracking ID
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

export const Scripts = () => {
	const googleAnalytics = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());`;
	return (
		<>
			<script async src={`https://ping.hashnode.com/gtag/js?id=${HASHNODE_GA_TRACKING_ID}`} />
			{GA_TRACKING_ID && (
				<script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
			)}
			<script dangerouslySetInnerHTML={{ __html: googleAnalytics }} />
		</>
	);
};
