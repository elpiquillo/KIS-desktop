import { Box, IconButton, Tab, Tabs } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { BlockInterface } from 'src/types/application/general-interface';
import { TabWithIconData } from 'src/types/application/tab-with-icon';
import ContainerView from '../container-view';

interface Props {
  blockInfo: BlockInterface<TabWithIconData>;
}

export default function TabWithIconView({ blockInfo }: Props) {
  const {
    data: { tab_content: tabsContent },
  } = blockInfo.blocs[0];

  const [currentTabId, setCurrentTabId] = useState(tabsContent[0].id);
  const [currentTabContainer, setCurrentTabContainer] = useState(tabsContent[0].container);

  const handleChangeTab = useCallback((_: React.SyntheticEvent, newValue: string) => {
    setCurrentTabId(newValue);
  }, []);

  useEffect(() => {
    const newTab = tabsContent.find((tab) => tab.id === currentTabId);
    if (newTab) {
      setCurrentTabContainer(newTab.container);
    }
  }, [currentTabId, tabsContent]);

  return (
    <Box>
      <Tabs variant="fullWidth" value={currentTabId} onChange={handleChangeTab} sx={{ mb: 2 }}>
        {tabsContent.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.title}
            value={tab.id}
            icon={
              <IconButton
                sx={{
                  '&:focus': {
                    outline: 'none',
                  },
                }}
              >
                <i className={tab.icon} style={{ fontSize: 24 }}>
                  <span className="path1" />
                  <span className="path2" />
                </i>
              </IconButton>
            }
            sx={{
              marginRight: 0,
              '&:focus': {
                outline: 'none',
              },
            }}
          />
        ))}
      </Tabs>
      <Iconify icon={tabsContent[0].icon} />

      <ContainerView container={currentTabContainer} />
    </Box>
  );
}
