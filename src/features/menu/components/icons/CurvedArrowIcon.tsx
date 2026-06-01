interface CurvedArrowIconProps {
  className?: string;
}

export function CurvedArrowIcon({ className = "w-6 h-6" }: CurvedArrowIconProps) {
  return (
    <svg
      xmlns="http://w3.org"
      viewBox="0 0 375 374.999991"
      fill="currentColor"
      className={className}
    >
      <defs><clipPath id="cbf0ee929c"><path d="M 0 0.46875 L 375 0.46875 L 375 374.71875 L 0 374.71875 Z M 0 0.46875 " clipRule="nonzero"/></clipPath></defs><g clipPath="url(#cbf0ee929c)"><path fill="#ffffff" d="M 110.308594 0.46875 L 0.078125 110.699219 L 110.308594 220.933594 L 154.421875 220.933594 L 154.421875 147.445312 L 242.214844 147.445312 C 274.867188 147.445312 301.394531 173.949219 301.394531 206.578125 C 301.394531 217.308594 298.488281 227.84375 292.976562 237.054688 L 233.171875 336.761719 L 296.132812 374.558594 L 355.984375 274.851562 C 368.355469 254.226562 374.882812 230.609375 374.882812 206.578125 C 374.882812 133.433594 315.382812 73.957031 242.214844 73.957031 L 154.421875 73.957031 L 154.421875 0.46875 Z M 110.308594 0.46875 " fillOpacity="1" fillRule="nonzero"/></g>
    </svg>
  );
}
