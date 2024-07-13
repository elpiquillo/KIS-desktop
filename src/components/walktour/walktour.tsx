import Joyride from 'react-joyride';

import { alpha, useTheme } from '@mui/material/styles';
import { grey } from 'src/theme/palette';

import { WalktourTooltip } from './walktour-tooltip';

import type { WalktourProps } from './types';

// ----------------------------------------------------------------------

export function Walktour({
  locale,
  continuous = true,
  showProgress = true,
  scrollDuration = 500,
  showSkipButton = true,
  disableOverlayClose = true,
  ...other
}: WalktourProps) {
  const theme = useTheme();

  const arrowStyles = {
    width: 20,
    height: 10,
    color: theme.palette.background.paper,
  };

  return (
    <Joyride
      scrollOffset={100}
      locale={{ last: 'Done', ...locale }}
      continuous={continuous}
      showProgress={showProgress}
      showSkipButton={showSkipButton}
      scrollDuration={scrollDuration}
      tooltipComponent={WalktourTooltip}
      disableOverlayClose={disableOverlayClose}
      floaterProps={{
        styles: {
          floater: { filter: 'none' },
          arrow: { spread: arrowStyles.width, length: arrowStyles.height },
        },
      }}
      styles={{
        options: {
          zIndex: 9999,
          arrowColor: arrowStyles.color,
        },
        overlay: {
          backgroundColor: alpha(grey[900], 0.8),
        },
        spotlight: {
          borderRadius: theme.shape.borderRadius * 2,
        },
        beacon: {
          outline: 0,
        },
        beaconInner: {
          backgroundColor: theme.palette.error.main,
        },
        beaconOuter: {
          borderColor: theme.palette.error.main,
          backgroundColor: alpha(theme.palette.error.main, 0.24),
        },
      }}
      {...other}
    />
  );
}
