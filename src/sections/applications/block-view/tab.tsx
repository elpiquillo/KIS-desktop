import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ContainerView from '../container-view';

interface TabContent {
  id: string;
  title: string;
  component: null | any;
}

interface Props {
  blockInfo: any;
}

export default function TabView({ blockInfo }: Props) {
  const {
    data: { tab_content: tabsContent },
  } = blockInfo.blocs[0];
  const [currentTabId, setCurrentTabId] = useState(tabsContent[0].id);
  const [currentTabContainer, setCurrentTabContainer] = useState(tabsContent[0].container);

  useEffect(() => {
    const newTab = tabsContent.find((tab: TabContent) => tab.id === currentTabId);
    setCurrentTabContainer(newTab?.container);
  }, [currentTabId, tabsContent]);

  return (
    <Box>
      <ToggleButtonGroup
        fullWidth
        exclusive
        size="small"
        color="success"
        value={currentTabId}
        onChange={(_, value) => setCurrentTabId(value)}
        sx={{ mb: 2 }}
      >
        {tabsContent.map((tab: TabContent) => (
          <ToggleButton
            key={tab.id}
            value={tab.id}
            sx={{
              color: 'grey.600',
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
