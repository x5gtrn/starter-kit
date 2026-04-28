import { useEffect, useState } from 'react';

interface TocItem {
	id: string;
	level: number;
	slug: string;
	title: string;
}

export const extractTocFromDom = (): TocItem[] => {
	const contentEl = document.querySelector('.hashnode-content-style');
	if (!contentEl) return [];

	return Array.from(
		contentEl.querySelectorAll<HTMLHeadingElement>('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]'),
	)
		.filter((el) => el.id.startsWith('heading-'))
		.map((el, index) => ({
			id: String(index),
			level: parseInt(el.tagName[1], 10),
			slug: el.id.replace(/^heading-/, ''),
			title: el.textContent?.trim() ?? '',
		}));
};

const TocSidebar = () => {
	const [activeId, setActiveId] = useState('');
	const [items, setItems] = useState<TocItem[]>([]);

	useEffect(() => {
		setItems(extractTocFromDom());
	}, []);

	useEffect(() => {
		if (!items.length) return;

		const headingEls = items
			.map((item) => document.getElementById(`heading-${item.slug}`))
			.filter((el): el is HTMLElement => el !== null);

		if (!headingEls.length) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
						break;
					}
				}
			},
			{ rootMargin: '0px 0px -70% 0px', threshold: 0 },
		);

		headingEls.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, [items]);

	if (!items.length) return null;

	const minLevel = items.reduce((min, item) => Math.min(min, item.level), Infinity);

	return (
		<nav aria-label="Table of contents">
			<p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
				On this page
			</p>
			<ul className="space-y-0.5">
				{items.map((item) => {
					const isActive = activeId === `heading-${item.slug}`;
					return (
						<li key={item.id} style={{ paddingLeft: `${(item.level - minLevel) * 12}px` }}>
							<a
								href={`#heading-${item.slug}`}
								className={[
									'block py-1 text-sm leading-snug no-underline transition-colors duration-150',
									isActive
										? 'font-semibold text-blue-600 dark:text-blue-400'
										: 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white',
								].join(' ')}
							>
								{item.title}
							</a>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};

export default TocSidebar;
