import React from "react";

interface BrandIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

/**
 * Official WhatsApp Brand Icon
 * Recognizable WhatsApp green circle with official white phone symbol.
 */
export function WhatsAppIcon({ className = "w-4 h-4", size, ...props }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="11" fill="#25D366" />
      <path
        d="M17.5 14.33c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/**
 * Official Facebook Brand Icon
 * Recognizable Facebook blue circle with official white "f" symbol.
 */
export function FacebookIcon({ className = "w-4 h-4", size, ...props }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      <path
        d="M13.5 8.5V7.2c0-.6.4-.8.9-.8h1.6V4h-2.2c-2.3 0-3.1 1.4-3.1 3.1v1.4H9v2.5h1.7V18h3.1v-7h2.1l.3-2.5h-2.7z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/**
 * Official Instagram Brand Icon
 * Recognizable Instagram rounded square with the signature multi-colour gradient
 * and crisp white camera glyph.
 */
export function InstagramIcon({ className = "w-4 h-4", size, ...props }: BrandIconProps) {
  const gradientId = "ig-brand-gradient";
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <defs>
        <radialGradient id={`${gradientId}-radial`} cx="20%" cy="110%" r="120%">
          <stop offset="0%" stopColor="#FFDD55" />
          <stop offset="10%" stopColor="#FFDD55" />
          <stop offset="50%" stopColor="#FF543E" />
          <stop offset="100%" stopColor="#C837AB" />
        </radialGradient>
        <linearGradient id={`${gradientId}-linear`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3771C8" />
          <stop offset="40%" stopColor="#6034A6" />
          <stop offset="70%" stopColor="#C837AB" />
          <stop offset="100%" stopColor="#FF543E" />
        </linearGradient>
      </defs>
      <rect width="22" height="22" x="1" y="1" rx="6" fill={`url(#${gradientId}-linear)`} />
      <rect width="22" height="22" x="1" y="1" rx="6" fill={`url(#${gradientId}-radial)`} opacity="0.85" />
      <rect
        x="6"
        y="6"
        width="12"
        height="12"
        rx="3.5"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        fill="none"
      />
      <circle cx="12" cy="12" r="2.8" stroke="#FFFFFF" strokeWidth="1.6" fill="none" />
      <circle cx="15.5" cy="8.5" r="0.85" fill="#FFFFFF" />
    </svg>
  );
}
