import { useEffect } from 'react';

type ImageLightboxProps = {
	src: string | null;
	alt?: string;
	closeModal: () => void;
};

export const ImageLightbox = ({ src, alt, closeModal }: ImageLightboxProps) => {
	useEffect(() => {
		if (!src) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				closeModal();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [src, closeModal]);

	if (!src) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm md:p-8"
			onClick={closeModal}
			role="dialog"
			aria-modal="true"
			aria-label={alt || '拡大画像'}
		>
			<div
				className="relative flex max-h-full max-w-full items-center justify-center"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					type="button"
					className="absolute -top-10 right-0 p-1 text-white/80 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:-right-10 md:-top-10"
					onClick={closeModal}
					aria-label="閉じる"
				>
					<svg
						className="h-6 w-6 fill-current"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
						/>
					</svg>
				</button>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={src}
					alt={alt || ''}
					className="max-h-[85vh] max-w-[90vw] cursor-zoom-out select-none rounded-md object-contain shadow-2xl transition-transform duration-200"
					onClick={closeModal}
				/>
			</div>
		</div>
	);
};
