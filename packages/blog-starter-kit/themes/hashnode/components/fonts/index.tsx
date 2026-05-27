import localFont from 'next/font/local';

const plusJakartaSans = localFont({
  src: [
    {
      path: '../../assets/PlusJakartaSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../assets/PlusJakartaSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../assets/PlusJakartaSans-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../assets/PlusJakartaSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../assets/PlusJakartaSans-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  display: 'swap',
});

const fontPlusJakartaSansVar = plusJakartaSans.style.fontFamily;

export const GlobalFontVariables = () => (
  <style jsx global>{`
    html {
      --font-inter: ${fontPlusJakartaSansVar};
      --font-plus-jakarta-sans: ${fontPlusJakartaSansVar};
    }
  `}</style>
);
