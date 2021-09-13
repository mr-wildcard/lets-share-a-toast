import React, { FunctionComponent, useState } from "react";
import { Image, ImageProps } from "@chakra-ui/react";

interface CustomImageProps extends ImageProps {
  width: number;
  height: number;
}

const srcPlaceholder =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

const Img: FunctionComponent<CustomImageProps> = ({
  src,
  width,
  height,
  style,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Image
      src={src}
      fallbackSrc={srcPlaceholder}
      style={{
        ...style,
        opacity: imageLoaded ? 1 : 0,
        visibility: imageLoaded ? "visible" : "hidden",
        width: `${width}px`,
        height: `${height}px`,
      }}
      transition="opacity 1000ms ease-out"
      htmlWidth={`${width}px`}
      htmlHeight={`${height}px`}
      onLoad={() => {
        setImageLoaded(true);
      }}
      {...props}
    />
  );
};

export default Img;
