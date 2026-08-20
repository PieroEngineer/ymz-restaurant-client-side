import React from 'react';

export interface OpendooriconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const Opendooricon: React.FC<OpendooriconProps> = ({
  size,
  width,
  height,
  ...props
}) => {
  return (
    <svg width="500" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="500" preserveAspectRatio="xMidYMid meet" version="1.0" {...props}>
      <path fill="#141772" d="M 200.15625 0 L 80.15625 37.5 C 77.167969 38.996094 75 42.011719 75 45 L 75 337.5 C 75 341.25 77.34375 344.238281 81.09375 345 L 201.09375 375 L 202.5 375 C 203.992188 375 205.457031 374.355469 206.953125 373.59375 C 208.445312 372.097656 210 369.753906 210 367.5 L 210 7.5 C 210 5.246094 208.445312 2.902344 206.953125 1.40625 C 204.695312 -0.0898438 202.410156 0 200.15625 0 Z M 225 30 L 225 45 L 285 45 L 285 330 L 225 330 L 225 345 L 292.5 345 C 296.628906 345 300 341.628906 300 337.5 L 300 37.5 C 300 33.371094 296.628906 30 292.5 30 Z M 180 180 C 184.511719 180 187.5 185.242188 187.5 191.25 C 187.5 197.253906 184.511719 202.5 180 202.5 C 175.488281 202.5 172.5 197.253906 172.5 191.25 C 172.5 185.242188 175.488281 180 180 180 Z M 180 180 " fillOpacity="1" fillRule="nonzero" />
    </svg>
  );
};

export default Opendooricon;
