import { useEmbeds } from '@starter-kit/utils/renderer/hooks/useEmbeds';
import { markdownToHtml } from '@starter-kit/utils/renderer/markdownToHtml';
import { memo, useState } from 'react';
import ImageLightbox from './image-lightbox';

type Props = {
	contentMarkdown: string;
};

const MarkdownToHtml = ({ contentMarkdown }: Props) => {
	const content = markdownToHtml(contentMarkdown);
	const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null);
	useEmbeds({ enabled: true });

	const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as HTMLElement;
		if (target && target.tagName === 'IMG') {
			const img = target as HTMLImageElement;
			const imageSrc = img.currentSrc || img.src;
			if (imageSrc) {
				setActiveImage({
					src: imageSrc,
					alt: img.alt || '',
				});
			}
		}
	};

	return (
		<>
			<div
				className="hashnode-content-style mx-auto w-full px-5 md:max-w-screen-md [&_img]:cursor-zoom-in [&_img]:transition-opacity hover:[&_img]:opacity-95"
				onClick={handleContentClick}
				dangerouslySetInnerHTML={{ __html: content }}
			/>
			{activeImage && (
				<ImageLightbox
					src={activeImage.src}
					alt={activeImage.alt}
					closeModal={() => setActiveImage(null)}
				/>
			)}
		</>
	);
};

export default MarkdownToHtml;
