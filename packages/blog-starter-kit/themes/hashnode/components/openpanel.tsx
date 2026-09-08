const OPENPANEL_CLIENT_ID = process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID;
const OPENPANEL_API_URL = process.env.NEXT_PUBLIC_OPENPANEL_API_URL;

/**
 * OpenPanel (https://openpanel.dev) analytics.
 *
 * This blog is a headless Hashnode frontend, so Hashnode's own OpenPanel
 * integration never runs here — the pages are served by this Next.js app, not
 * by Hashnode. The tracker therefore has to be loaded client-side by us.
 *
 * Only the client ID belongs in the browser; the client secret is for
 * server-to-server events and must never be exposed through NEXT_PUBLIC_*.
 *
 * `trackScreenViews` patches history.pushState/replaceState, so client-side
 * navigations between posts are counted as separate screen views. Views are
 * grouped by URL path (e.g. /article-2026-09-07-0152) in the OpenPanel UI.
 */
export const OpenPanel = () => {
	if (!OPENPANEL_CLIENT_ID) return null;

	const openPanel = `
    window.op = window.op || function () {
      var q = [];
      return new Proxy(function () {
        arguments.length && q.push([].slice.call(arguments));
      }, {
        get: function (t, k) {
          return k === 'q' ? q : function () { q.push([k].concat([].slice.call(arguments))); };
        },
        has: function (t, k) { return k === 'q'; }
      });
    }();
    window.op('init', {
      clientId: ${JSON.stringify(OPENPANEL_CLIENT_ID)},${
				OPENPANEL_API_URL ? `\n      apiUrl: ${JSON.stringify(OPENPANEL_API_URL)},` : ''
			}
      trackScreenViews: true,
      trackOutgoingLinks: true,
      trackAttributes: true,
      // Keep local development traffic out of the project.
      disabled: /^(localhost|127\\.0\\.0\\.1|\\[::1\\])$/.test(window.location.hostname),
    });
  `;

	return (
		<>
			<script type="text/javascript" dangerouslySetInnerHTML={{ __html: openPanel }} />
			<script src="https://openpanel.dev/op1.js" defer async />
		</>
	);
};
