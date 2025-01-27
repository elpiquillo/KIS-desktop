import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

// import SvgColor from 'components/svg-color';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  // <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  <Iconify icon={name} sx={{ width: 1, height: 1 }} />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);
const ICONS = {
  home: icon('lets-icons:home-duotone'),
  apps: icon('solar:window-frame-bold-duotone'),
  users: icon('solar:users-group-rounded-bold-duotone'),
  database: icon('solar:server-minimalistic-bold-duotone'),
  automations: icon('solar:routing-3-bold-duotone'),
  settings: icon('solar:settings-bold-duotone'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'overview',
        items: [
          { title: 'Home', id: 'sidebar-home', path: paths.main.root, icon: ICONS.home },
          { title: 'My apps', id: 'sidebar-apps', path: paths.main.apps, icon: ICONS.apps },
        ],
      },
    ],
    []
  );

  return data;
}
