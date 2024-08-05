import { ChangeEvent } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import "../../styles/common/ChatTextfield.scss";

interface Props {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onEnterPress?: () => void;
}

export default function Textfield(props: Props) {
  const { label, value, onChange } = props;

  return (
    <Box className="ChatTextfield__container">
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && props.onEnterPress) {
            props.onEnterPress();
          }
        }}
        variant="standard"
        fullWidth
      />
    </Box>
  );
}
