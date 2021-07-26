import React, { useRef, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { FONT_SANS, FONT_MONO } from '../lib/const';

const BlockTextarea = (props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (props.id === 'title' && !props.defaultValue) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <TextareaAutosize
      ref={inputRef}
      defaultValue={props.defaultValue}
      spellCheck={false}
      style={{
        background: 'transparent',
        width: '100%',
        resize: 'none',
        fontFamily: props.fontFamily || FONT_MONO,
        fontWeight: props.fontWeight || 'normal',
        fontSize: props.fontSize || '13px',
        border: 'none',
        lineHeight: 1.5,
        textAlign: 'center',
        paddingLeft: props.px,
        paddingRight: props.px,
        paddingTop: props.py,
        paddingBottom: props.py,
        overflow: 'hidden',
      }}
      placeholder={props.placeholder}
      onChange={(t) => {
        props.onChange(t);
      }}
    />
  );
};
export default BlockTextarea;
