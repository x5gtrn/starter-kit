import * as DialogPrimitive from '@radix-ui/react-dialog';
import { CloseSVG } from './icons/svgs';
import Button from './hn-button';

type ImageLightboxProps = {
	src: string | null;
	alt?: string;
	closeModal: () => void;
};

export default function ImageLightbox({ src, alt, closeModal }: ImageLightboxProps) {
	if (!src) {
		return null;
	}

	return (
		<DialogPrimitive.Root open={Boolean(src)} onOpenChange={(open) => !open && closeModal()}>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay
					onClick={closeModal}
					className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-200 ease-out"
				/>
				<DialogPrimitive.Content
					onEscapeKeyDown={closeModal}
					className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none md:p-8"
					onClick={closeModal}
				>
					<DialogPrimitive.DialogTitle className="sr-only">
						{alt || '拡大画像'}
					</DialogPrimitive.DialogTitle>
					<div
						className="relative flex max-h-full max-w-full items-center justify-center"
						onClick={(e) => e.stopPropagation()}
					>
						<DialogPrimitive.Close
							className="absolute -top-10 right-0 text-white/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:-right-10 md:-top-10"
							asChild
						>
							<Button
								className="p-1 focus:outline-none"
								onClick={closeModal}
								aria-label="閉じる"
								variant="transparent"
							>
								<CloseSVG className="h-6 w-6 fill-current text-white" />
							</Button>
						</DialogPrimitive.Close>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={src}
							alt={alt || ''}
							className="max-h-[85vh] max-w-[90vw] cursor-zoom-out select-none rounded-md object-contain shadow-2xl transition-transform duration-200"
							onClick={closeModal}
						/>
					</div>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}
