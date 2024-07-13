import { Box, Container, Typography } from "@mui/material";
import Iconify from "../iconify";

interface SidebarComponentProps {
  id: string;
  title: string;
  icon: string;
}

export default function SidebarComponent({
  id,
  title,
  icon
}: SidebarComponentProps) {
  return (
    <Box
      sx={{
        cursor: 'pointer',
      }}
      textAlign="center"
      height={82}
      width={124}
    >
      <Container
        sx={{
          height: 56,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          border: 1,
          borderColor: 'grey.200',
          borderRadius: 1,
          backgroundColor: "grey.200",
          '&:hover': {
            borderColor: 'grey.300',
            backgroundColor: 'grey.0',
            transition: 'box-shadow 0.1s ease-in-out',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Iconify
          icon={icon}
          height={25}
          width={25}
          color="grey.600"
        />
      </Container>

      <Typography variant="body2">
        {title}
      </Typography>
    </Box>
  )
}