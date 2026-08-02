const PROVIDERS = [
	{
		hosts: ['speakerdeck.com', 'www.speakerdeck.com'],
		endpoint: 'https://speakerdeck.com/oembed.json',
		playerOrigin: 'https://speakerdeck.com',
	},
];

const EMBED_CARD_ANCHOR = /<a\b[^>]*\bclass="[^"]*\bembed-card\b[^"]*"[^>]*>[\s\S]*?<\/a>/gi;

type OEmbedResponse = {
	html?: unknown;
	title?: unknown;
	width?: unknown;
	height?: unknown;
};

function escapeAttribute(value: string) {
	return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function findProvider(href: string) {
	try {
		const { hostname } = new URL(href);
		return PROVIDERS.find((provider) => provider.hosts.includes(hostname)) ?? null;
	} catch (error) {
		return null;
	}
}

// The oEmbed payload is third-party HTML, so we take only the player src and rebuild
// the iframe ourselves rather than injecting the returned markup.
function extractPlayerSrc(html: unknown, playerOrigin: string) {
	if (typeof html !== 'string') return null;

	const src = html.match(/<iframe\b[^>]*\bsrc="([^"]+)"/i)?.[1];
	if (!src) return null;

	try {
		return new URL(src).origin === playerOrigin ? src : null;
	} catch (error) {
		return null;
	}
}

function buildIframe(src: string, { title, width, height }: OEmbedResponse) {
	const hasRatio = typeof width === 'number' && typeof height === 'number' && height > 0;
	const ratio = hasRatio ? `${width}/${height}` : '16/9';
	const label = typeof title === 'string' ? title : 'Embedded content';

	return `<iframe src="${escapeAttribute(src)}" title="${escapeAttribute(
		label,
	)}" loading="lazy" allowfullscreen style="width:100%;aspect-ratio:${ratio};border:0;"></iframe>`;
}

async function resolveEmbed(anchor: string) {
	const href = anchor.match(/\bhref="([^"]+)"/i)?.[1];
	if (!href) return null;

	const provider = findProvider(href);
	if (!provider) return null;

	try {
		const response = await fetch(`${provider.endpoint}?url=${encodeURIComponent(href)}`, {
			headers: { 'user-agent': 'Mozilla/5.0' },
		});

		if (!response.ok) return null;

		const data: OEmbedResponse = await response.json();
		const src = extractPlayerSrc(data.html, provider.playerOrigin);
		if (!src) return null;

		return buildIframe(src, data);
	} catch (error) {
		console.warn('Failed to resolve oEmbed card', { error, href });
		return null;
	}
}

export async function resolveEmbedCards(html: string) {
	const anchors = [...html.matchAll(EMBED_CARD_ANCHOR)];
	if (anchors.length === 0) return html;

	const embeds = await Promise.all(anchors.map((anchor) => resolveEmbed(anchor[0])));

	let result = '';
	let cursor = 0;

	anchors.forEach((anchor, index) => {
		const embed = embeds[index];
		if (!embed || anchor.index === undefined) return;

		result += html.slice(cursor, anchor.index) + embed;
		cursor = anchor.index + anchor[0].length;
	});

	return result + html.slice(cursor);
}
