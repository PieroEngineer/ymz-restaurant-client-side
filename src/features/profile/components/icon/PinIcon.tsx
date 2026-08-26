import React from 'react';

export interface PiniconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const Pinicon: React.FC<PiniconProps> = ({
  size,
  width,
  height,
  className,
  ...props
}) => {
  return (
    <svg width="50" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="50" preserveAspectRatio="xMidYMid meet" version="1.0" {...props}>
      <defs>
        <clipPath id="514969488b">
          <path d="M 55 0 L 319.75 0 L 319.75 375 L 55 375 Z M 55 0 " clipRule="nonzero" />
        </clipPath>
      </defs>
      <g clipPath="url(#514969488b)">
        <path fill="currentColor" d="M 187.496094 0.53125 C 114.4375 0.53125 55 59.96875 55 133.027344 C 55 204.078125 177.320312 361.585938 182.523438 368.257812 L 187.496094 374.628906 L 192.472656 368.257812 C 197.675781 361.585938 319.996094 204.078125 319.996094 133.027344 C 319.996094 59.96875 260.558594 0.53125 187.496094 0.53125 Z M 187.496094 76.242188 C 218.808594 76.242188 244.28125 101.71875 244.28125 133.027344 C 244.28125 164.339844 218.808594 189.8125 187.496094 189.8125 C 156.1875 189.8125 130.714844 164.339844 130.714844 133.027344 C 130.714844 101.71875 156.1875 76.242188 187.496094 76.242188 Z M 187.496094 76.242188 " fillOpacity="1" fillRule="nonzero" />
      </g>
    </svg>
  );
};

export default Pinicon;
