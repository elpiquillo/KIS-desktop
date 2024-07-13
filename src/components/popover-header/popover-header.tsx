import { Box, IconButton, Typography } from "@mui/material";
import Iconify from "../iconify";

interface Props {
  title?: string;
  handleClose?: () => void;
  sx?: object;
}

export default function PopoverHeader({ title, handleClose, sx }: Props) {
  return (
    <Box p={1} sx={{ backgroundColor: "grey.200", ...sx }}>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      {handleClose && (
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: "4px",
            top: "4px",
            color: 'grey.500',
          }}
        >
          <Iconify width="15px" icon='mdi:close' />
        </IconButton>
      )}
    </Box>
  );
}