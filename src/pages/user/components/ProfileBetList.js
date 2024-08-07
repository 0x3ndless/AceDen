// @mui
import { Box } from '@mui/material';

//components
import ProfileBetCard from './ProfileBetCard';


export default function ProfileBetList({betList}) {

  
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
      }}
    >
      <>
          {betList && betList.length > 0 && 
            <>
            {betList && betList.map((item) => (     
                <ProfileBetCard key={item._id} data={item}/>
                )
            )}
            </>
          }
      </>
    </Box>
  );
}
