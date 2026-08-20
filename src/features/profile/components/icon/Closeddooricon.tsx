import React from 'react';

export interface CloseddooriconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const Closeddooricon: React.FC<CloseddooriconProps> = ({
  size,
  width,
  height,
  ...props
}) => {
  return (
    <svg width="500" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="500" preserveAspectRatio="xMidYMid meet" version="1.0" {...props}>
      <defs>
        <clipPath id="e7af6fd9c5">
          <path d="M 75 0 L 300 0 L 300 375 L 75 375 Z M 75 0 " clipRule="nonzero" />
        </clipPath>
        <clipPath id="2365b272a4">
          <path d="M 89.101562 0 L 285.898438 0 C 293.6875 0 300 6.3125 300 14.101562 L 300 360.898438 C 300 368.6875 293.6875 375 285.898438 375 L 89.101562 375 C 81.3125 375 75 368.6875 75 360.898438 L 75 14.101562 C 75 6.3125 81.3125 0 89.101562 0 Z M 89.101562 0 " clipRule="nonzero" />
        </clipPath>
        <clipPath id="f7c7b87159">
          <path d="M 0 0 L 225 0 L 225 375 L 0 375 Z M 0 0 " clipRule="nonzero" />
        </clipPath>
        <clipPath id="4b9cc68e96">
          <path d="M 14.101562 0 L 210.898438 0 C 218.6875 0 225 6.3125 225 14.101562 L 225 360.898438 C 225 368.6875 218.6875 375 210.898438 375 L 14.101562 375 C 6.3125 375 0 368.6875 0 360.898438 L 0 14.101562 C 0 6.3125 6.3125 0 14.101562 0 Z M 14.101562 0 " clipRule="nonzero" />
        </clipPath>
        <clipPath id="4b5e2cdd07">
          <rect x="0" width="225" y="0" height="375" />
        </clipPath>
        <clipPath id="6345902576">
          <path d="M 265.796875 175.476562 L 289.84375 175.476562 L 289.84375 199.523438 L 265.796875 199.523438 Z M 265.796875 175.476562 " clipRule="nonzero" />
        </clipPath>
        <clipPath id="273eafd6c8">
          <path d="M 277.820312 175.476562 C 271.179688 175.476562 265.796875 180.859375 265.796875 187.5 C 265.796875 194.140625 271.179688 199.523438 277.820312 199.523438 C 284.460938 199.523438 289.84375 194.140625 289.84375 187.5 C 289.84375 180.859375 284.460938 175.476562 277.820312 175.476562 Z M 277.820312 175.476562 " clipRule="nonzero" />
        </clipPath>
        <clipPath id="d6cb6737f1">
          <path d="M 0.796875 0.476562 L 24.84375 0.476562 L 24.84375 24.523438 L 0.796875 24.523438 Z M 0.796875 0.476562 " clipRule="nonzero" />
        </clipPath>
        <clipPath id="371cdfb3ab">
          <path d="M 12.820312 0.476562 C 6.179688 0.476562 0.796875 5.859375 0.796875 12.5 C 0.796875 19.140625 6.179688 24.523438 12.820312 24.523438 C 19.460938 24.523438 24.84375 19.140625 24.84375 12.5 C 24.84375 5.859375 19.460938 0.476562 12.820312 0.476562 Z M 12.820312 0.476562 " clipRule="nonzero" />
        </clipPath>
        <clipPath id="708bf02243">
          <rect x="0" width="25" y="0" height="25" />
        </clipPath>
      </defs>
      <g clipPath="url(#e7af6fd9c5)">
        <g clipPath="url(#2365b272a4)">
          <g transform="matrix(1, 0, 0, 1, 75, 0)">
            <g clipPath="url(#4b5e2cdd07)">
              <g clipPath="url(#f7c7b87159)">
                <g clipPath="url(#4b9cc68e96)">
                  <rect x="-157.5" width="540" fill="#141772" height="539.999987" y="-82.499998" fillOpacity="1" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#6345902576)">
        <g clipPath="url(#273eafd6c8)">
          <g transform="matrix(1, 0, 0, 1, 265, 175)">
            <g clipPath="url(#708bf02243)">
              <g clipPath="url(#d6cb6737f1)">
                <g clipPath="url(#371cdfb3ab)">
                  <path fill="#ffffff" d="M 0.796875 0.476562 L 24.84375 0.476562 L 24.84375 24.523438 L 0.796875 24.523438 Z M 0.796875 0.476562 " fillOpacity="1" fillRule="nonzero" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default Closeddooricon;
