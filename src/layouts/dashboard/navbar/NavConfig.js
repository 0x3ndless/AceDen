// components
import Iconify from '../../../components/Iconify';
import Label from '../../../components/Label';
// ----------------------------------------------------------------------

const sidebarConfig = [

  // GENERAL

  {
    subheader: 'General',
    items: [
      { title: 'Dashboard', path: '/dashboard', icon: <Iconify icon="material-symbols:dashboard-rounded"/> }, 
      {
        title: 'Community',
        icon: <Iconify icon="ri:group-2-fill"/>,
        children: [
          { title: 'Overview', path: '/community/overview' }, 
          { title: 'Leaderboard', path: '/community/leaderboard' }, 
          { title: 'Theme', path: '/community/theme' }, 
        ],
      },
    ]
  },


  

  //Token Management

  {
    subheader: 'Token Management',
    items: [
      { title: 'Collections', path: '/collections', icon: <Iconify icon="bx:collection"/> }, 
      {
        title: 'Mint',
        icon: <Iconify icon="ri:nft-fill"/>,
        children: [
          { title: 'Quick Mint', path: '/mint/quick'}, 
          { title: 'Lazy Mint', path: '/mint/lazy', info: ( <Label color="success">Gasless</Label> )}, 
        ],
      },
      { title: 'Tasks & Levels', path: '/tasks', icon: <Iconify icon="icon-park-outline:level"/> }, 
      { title: 'Utility', path: '/utility', icon: <Iconify icon="fluent:apps-16-regular"/> }, 
    ]
  },



  //Utility

  {
    subheader: 'User',
    items: [
      { title: 'Settings', path: '/settings', icon: <Iconify icon="uil:setting"/> }, 
    ]
  },


  
  
];

export default sidebarConfig;
