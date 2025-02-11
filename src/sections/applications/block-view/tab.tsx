import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BlockInterface } from 'src/types/application/general-interface';
import { TabData } from 'src/types/application/tab-interface';
import ContainerView from '../container-view';

interface Props {
  blockInfo: BlockInterface<TabData>;
}

export default function TabView({ blockInfo }: Props) {
  const {
    data: { full_width: fullWidth, tab_content: tabsContent },
  } = blockInfo.blocs[0];
  const [currentTabId, setCurrentTabId] = useState(tabsContent[0].id);
  const [currentTabContainer, setCurrentTabContainer] = useState(tabsContent[0].container);

  useEffect(() => {
    const newTab = tabsContent.find((tab) => tab.id === currentTabId);
    if (newTab) {
      setCurrentTabContainer(newTab.container);
    }
  }, [currentTabId, tabsContent]);

  return (
    <Box>
      <ToggleButtonGroup
        exclusive
        size="small"
        fullWidth={fullWidth}
        value={currentTabId}
        onChange={(_, value) => setCurrentTabId(value)}
        sx={{ mb: 2, backgroundColor: 'background.neutral' }}
      >
        {tabsContent.map((tab) => (
          <ToggleButton
            key={tab.id}
            value={tab.id}
            disableRipple
            sx={{
              color: 'text.secondary',
              '&.Mui-selected': {
                backgroundColor: 'background.paper',
                boxShadow: (theme) => `${theme.customShadows.z1} !important`,
              },
              '&:hover': {
                backgroundColor: 'background.neutral',
                '&.Mui-selected': {
                  backgroundColor: 'background.paper',
                },
              },
              '&:focus': {
                outline: 'none',
              },
            }}
          >
            {tab.title}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <ContainerView container={currentTabContainer} />
    </Box>
  );
}
