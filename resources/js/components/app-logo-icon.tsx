import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img 
            {...props} 
            src="/images/image.png" 
            alt="Logo" 
            className={`object-contain ${props.className || ''}`}
        />
    );
}
