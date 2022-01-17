import React, {
  FunctionComponent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Input, Text } from "@chakra-ui/react";

import css from "web/src/subjects/components/filters/FilterSearch.module.css";
import HighlightedText from "@web/core/components/HighlightedText";

interface Props {
  onSearchChanged(search: string): void;
}

const FilterSearch: FunctionComponent<Props> = ({ onSearchChanged }) => {
  const input = useRef() as React.MutableRefObject<HTMLInputElement>;
  const text = useRef() as React.MutableRefObject<HTMLSpanElement>;

  const [focus, setFocus] = useState(false);
  const [textWidth, setTextWidth] = useState<null | number>(null);

  useEffect(() => {
    if (focus && input.current) {
      input.current.focus();
    }
  }, [focus, input.current]);

  useLayoutEffect(() => {
    if (text.current) {
      setTextWidth(text.current.getBoundingClientRect().width);
    }
  }, [text.current]);

  return (
    <Text
      d="inline-block"
      style={{
        width: `${textWidth}px`,
      }}
    >
      {focus ? (
        <HighlightedText bgColor="white" d="inline-block" mx={2}>
          <Input
            ref={input}
            d="inline-block"
            textAlign="center"
            className={css.input}
            fontWeight="bold"
            fontSize="inherit"
            borderRadius={0}
            variant="unstyled"
            marginRight="40px"
            onChange={({ target }) => onSearchChanged(target.value)}
            onBlur={(e) => {
              if (!e.currentTarget.value.length) {
                setFocus(false);
              }
            }}
          />
        </HighlightedText>
      ) : (
        <Text
          as="span"
          // TS expects a ref of `p` element as Text component returns a paragraph by default.
          // @ts-ignore
          ref={text}
          textDecoration="underline"
          onClick={() => setFocus(true)}
        >
          absolutely everything
        </Text>
      )}
    </Text>
  );
};

export default React.memo(FilterSearch);
