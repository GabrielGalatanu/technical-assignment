import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import "../../styles/common/BasicButton.scss";

interface Props {
  label: string;
  onPress: (e: any) => void;
  config?: {
    small?: boolean;
  };
}

const BasicButton = (props: Props) => {
  const { label, onPress, config } = props;

  let BoxClass = "basic-button__container";

  if (config?.small) BoxClass += " basic-button__container--small";

  return (
    <Box className={BoxClass}>
      <Button variant="contained" onClick={onPress} className="button">
        {label}
      </Button>
    </Box>
  );
};

export default BasicButton;
