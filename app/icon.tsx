import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '20%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Glow */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(52, 211, 153, 0.4) 0%, transparent 70%)',
          }}
        />
        
        {/* Neon P Shape Icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" /> {/* cyan */}
              <stop offset="50%" stopColor="#818cf8" /> {/* indigo */}
              <stop offset="100%" stopColor="#f472b6" /> {/* pink */}
            </linearGradient>
          </defs>
          <path
            d="M40 80V35C40 25 50 20 65 20C80 20 85 30 85 45C85 60 75 70 55 70H40"
            stroke="url(#icon-grad)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
