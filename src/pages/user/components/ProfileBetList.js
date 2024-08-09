// @mui
import { Box } from '@mui/material';

//components
import ProfileBetCard from './ProfileBetCard';


export default function ProfileBetList({betList}) {
  
  return (
    <Box sx={{ display: 'flex',  }} >
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(2, 1fr)',
        },
        gap: 5, 
        justifyItems: 'center', 
      }}
    >
      {betList && betList.length > 0 && 
        betList.map((item) => (
          <ProfileBetCard key={item._id} data={item} />
        ))}
    </Box>
  </Box>
  );
}
