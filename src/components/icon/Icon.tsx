import React from "react";

interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string; // path to SVG file
  alt?: string;
  size?: number; // size in px, applies to width & height
}

const Icon: React.FC<IconProps> = ({
  src,
  alt = "icon",
  size = 32,
  ...rest
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      {...rest}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        ...rest.style
      }}
    />
  );
};

export default Icon;
