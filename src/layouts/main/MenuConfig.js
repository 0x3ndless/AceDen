// components
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22,
};

const menuConfig = [
  {
    title: 'Leaderboard',
    icon: <Iconify icon={'material-symbols:trophy-outline'} {...ICON_SIZE} />,
    path: '/leaderboard',
  },
];

export default menuConfig;
