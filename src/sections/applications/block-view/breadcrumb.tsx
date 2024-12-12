import React from 'react';
import { Box, Breadcrumbs, Typography } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import { useParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

interface Props {
  blockInfo: any;
}

export default function BreadcrumbView({ blockInfo }: Props) {
  const { applicationId } = useParams();
  const { data } = blockInfo.blocs[0];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="h6" sx={{ color: 'text.primary' }}>
        {data.current_page}
      </Typography>
      <Breadcrumbs
        sx={{
          '& .MuiBreadcrumbs-separator': {
            mx: 0.5,
          },
        }}
      >
        {data.right_links.map((link: { id: string; page_link: string; page_name: string }) => (
          <Typography
            key={link.id}
            variant="body2"
            sx={{ color: 'success.main' }}
            component={RouterLink}
            href={`${paths.main.root}${applicationId}/${link.page_link}`}
          >
            {link.page_name}
          </Typography>
        ))}
      </Breadcrumbs>
    </Box>
  );
}
