import React, {
  FunctionComponent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import * as C from '@chakra-ui/core';

import css from './FilterSearch.module.css';
import HighlightedText from 'frontend/core/components/HighlightedText';

interface Props {
  onSearchChanged(search: string): void;
}

const FilterSearch: FunctionComponent<Props> = ({ onSearchChanged }) => {
  const input = useRef<HTMLInputElement>();
  const text = useRef<HTMLSpanElement>();
  const [focus, setFocus] = useState(false);
  const [textWidth, setTextWidth] = useState<null | number>(null);

  useEffect(() => {
    if (focus) {
      input.current.focus();
    }
  }, [focus]);

  useLayoutEffect(() => {
    setTextWidth(text.current.getBoundingClientRect().width);
  }, []);

  return (
    <C.Text
      d="inline-block"
      style={{
        width: `${textWidth}px`,
      }}
    >
      {focus ? (
        <HighlightedText bgColor="white" d="inline-block" mx={2}>
          <C.Input
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
        <C.Text
          as="span"
          // TS expects a ref of `p` element as Text component returns a paragraph by default.
          // @ts-ignore
          ref={text}
          textDecoration="underline"
          onClick={() => setFocus(true)}
        >
          absolutely everything
        </C.Text>
      )}
    </C.Text>
  );
};

export default React.memo(FilterSearch);
