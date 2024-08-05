import { ChangeEvent } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import "../../styles/common/Textfield.scss";

interface Props {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function Textfield(props: Props) {
  const { label, value, onChange } = props;

  return (
    <Box className="textfield__container">
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        variant="standard"
        fullWidth
      />
    </Box>
  );
}
