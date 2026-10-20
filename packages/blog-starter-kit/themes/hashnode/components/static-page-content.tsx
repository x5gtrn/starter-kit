import { useState } from 'react';
import { RequiredStaticPageFieldsFragment } from '../generated/graphql';
import ImageLightbox from './image-lightbox';

type Props = {
  pageContent: RequiredStaticPageFieldsFragment;
};

function StaticPageContent(props: Props) {
  const { content, title } = props.pageContent;
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null);

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
    <div className={`blog-page-card pb-32`}>
      <div
        className={`blog-page-content prose prose-lg mx-auto break-words tracking-tight dark:prose-dark xl:prose-xl`}
        onClick={handleContentClick}
      >
        <h1
          className={`blog-page-title mb-10 break-words text-3xl font-bold text-black dark:text-white md:text-4xl xl:text-5xl`}
        >
          {title}
        </h1>
        <div
          dangerouslySetInnerHTML={{
            __html: content.html,
          }}
        />
      </div>
      {activeImage && (
        <ImageLightbox
          src={activeImage.src}
          alt={activeImage.alt}
          closeModal={() => setActiveImage(null)}
        />
      )}
    </div>
  );
}

export default StaticPageContent;
