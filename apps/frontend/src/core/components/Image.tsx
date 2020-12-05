import React, { FunctionComponent, useEffect, useState } from 'react';
import * as C from '@chakra-ui/core';

type CustomImageProps = C.ImageProps & {
  width: number;
  height: number;
};

const srcPlaceholder =
  'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

const Img: FunctionComponent<CustomImageProps> = ({
  src,
  width,
  height,
  style,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const image = new Image(width, height);

    image.onload = () => setImageLoaded(true);
    image.src = src;

    return () => {
      image.onload = null;
    };
  }, [src, width, height]);

  return (
    <C.Box
      as="img"
      src={imageLoaded ? src : srcPlaceholder}
      style={{
        ...style,
        opacity: showImage ? 1 : 0,
        visibility: showImage ? 'visible' : 'hidden',
      }}
      opacity={0}
      transition="opacity 1000ms ease-out"
      width={`${width}px`}
      height={`${height}px`}
      // TS screams that `onLoad` event is not for HTMLDivElement, but I'm using `as="img"` here so everything's fine.
      // @ts-ignore
      onLoad={() => {
        if (imageLoaded) {
          setShowImage(true);
        }
      }}
      {...props}
    />
  );
};

export default Img;
