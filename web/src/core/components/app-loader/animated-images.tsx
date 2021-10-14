import React, { useCallback, useEffect, useMemo, useState } from "react";
import { animated, config, useTransition } from "@react-spring/web";

const defaultTransitions = {
  from: {
    transform: "scale(0.5) skewX(30deg) rotate(-85deg)",
    opacity: 0,
    config: config.wobbly,
  },
  enter: {
    transform: "scale(1) skewX(0deg) rotate(0deg)",
    opacity: 1,
    config: config.wobbly,
  },
  leave: {
    transform: "scale(0.5) skewX(0) rotate(180deg)",
    opacity: 0,
    config: {
      duration: 100,
    },
  },
};

const ALL_GIFS = [
  {
    src: "https://media.giphy.com/media/XgGwL8iUwHIOOMNwmH/giphy.webp",
  },
  { src: "https://media.giphy.com/media/ghNu5dkCg0yYJKhPtE/giphy.webp" },
  {
    src: "https://media.giphy.com/media/8YTmbulkH7wWNRnURI/giphy.webp",
  },
];

export const AnimatedImages = () => {
  const [shownIndex, setShownIndex] = useState(-1);
  const [images, setImages] = useState<Map<string, boolean>>(new Map());

  /**
   * Compute next image index to display.
   */
  const nextIndex = useMemo(
    () => (shownIndex + 1 < ALL_GIFS.length ? shownIndex + 1 : 0),
    [shownIndex]
  );

  const loadImage = useCallback(
    (gifIndex: number) => {
      const { src } = ALL_GIFS[gifIndex];

      const image = new Image();

      setImages(images.set(src, false));

      image.onload = () => {
        setImages(images.set(src, true));

        /**
         * If it's the first image to be loaded, automatically display it.
         */
        if (gifIndex === 0) {
          setShownIndex(0);
        }
      };

      image.src = ALL_GIFS[gifIndex].src;

      return () => {
        image.onload = null;
      };
    },
    [images]
  );

  const gotoImage = useCallback(
    (index) => {
      const { src } = ALL_GIFS[index];

      /**
       * If it's true, image has been loaded.
       */
      if (images.get(src)) {
        setShownIndex(index);
      } else {
        loadImage(index);
      }
    },
    [images, loadImage]
  );

  /**
   * Effect for loading the first image.
   */
  useEffect(() => {
    let interval: number;

    /**
     * If `images` is empty, it means that we need to load
     * the very first image.
     */
    if (!images.size) {
      gotoImage(nextIndex);
    } else {
      interval = setInterval(() => {
        gotoImage(nextIndex);
      }, 2000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [nextIndex, gotoImage, images.size]);

  const loaders = useTransition(shownIndex, {
    from: defaultTransitions.from,
    enter: defaultTransitions.enter,
    leave: defaultTransitions.leave,
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "400px",
        height: "300px",
        position: "relative",
      }}
    >
      <img
        style={{
          position: "absolute",
        }}
        alt="Background loader animation"
        src="https://media.giphy.com/media/j2AqKHK9rq217Ag8EX/giphy.gif"
        width={248}
        height={264}
      />

      {loaders((styles, item) => {
        return (
          ALL_GIFS[item] && (
            <animated.img
              alt="Loading..."
              src={ALL_GIFS[item].src}
              style={{
                ...styles,
                position: "absolute",
                transformOrigin: "center center",
                maxWidth: "190px",
                height: "auto",
              }}
            />
          )
        );
      })}
    </div>
  );
};
