import React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import { useParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

interface Props {
  blockInfo: any;
}

export default function ItemListView({ blockInfo }: Props) {
  const { applicationId } = useParams();
  const { data } = blockInfo.blocs[0];

  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: `repeat(${data.card_content.length}, 1fr)`,
        gap: 2,
      }}
    >
      {data.card_content.map((card: any) => (
        <Card
          key={card.id}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 2,
          }}
        >
          <CardContent sx={{ padding: '12px 0' }}>
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              {card.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              {card.title}
            </Typography>
          </CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {data.button_action.map((button: any) => (
              <Button
                key={button.id}
                fullWidth
                variant="contained"
                sx={{
                  borderRadius: 0.5,
                  '&:hover': {
                    color: 'background.paper',
                  },
                }}
                component={RouterLink}
                href={`${paths.main.root}${applicationId}/${button.page_id}`}
              >
                {button.text}
              </Button>
            ))}
          </Box>
        </Card>
      ))}
    </Box>
  );
}
