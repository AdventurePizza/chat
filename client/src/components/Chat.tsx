import { Button, TextField } from "@material-ui/core";
import React, { useRef, useState } from "react";

interface IChatProps {
  sendMessage: (message: string) => void;
}

export const Chat = ({ sendMessage }: IChatProps) => {
  const [chatValue, setChatValue] = useState("");
  const textfieldRef = useRef<HTMLDivElement>(null);

  const onChangeChat = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChatValue(event.target.value);
  };

  const onKeyPressChat = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage(chatValue);
      setChatValue("");
    }
  };

  const onButtonClickChat = () => {
    sendMessage(chatValue);
    setChatValue("");
  };

  const onFocus = () => {
    if (window.innerWidth < 500 && textfieldRef.current) {
      const offsetTop = textfieldRef.current.offsetTop;
      document.body.scrollTop = offsetTop;
    }
  };

  return (
    <div className="chat-container">
      <TextField
        autoFocus
        ref={textfieldRef}
        placeholder="type a message"
        variant="outlined"
        value={chatValue}
        onChange={onChangeChat}
        onKeyPress={onKeyPressChat}
        style={{ marginRight: 5 }}
        onFocus={onFocus}
      />
      <Button onClick={onButtonClickChat}>send</Button>
    </div>
  );
};
