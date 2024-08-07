// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, Stack, Divider, Avatar } from '@mui/material';
// components
import Iconify from '../../../components/Iconify';
//------
import { useSelector } from 'react-redux';
import Label from '../../../components/Label';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));


const InfoStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  marginTop: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(3),
  },
}));

// ----------------------------------------------------------------------

export default function ProfileDetailsCard({ userData }) {
  const { loadingUser } = useSelector((state) => ({ ...state.app }));

  return (
    <>
      <Card sx={{ boxShadow: 4 }}>
        <InfoStyle>
          <Avatar
            sx={{
              mx: 'auto',
              borderWidth: 1.9,
              borderStyle: 'dotted',
              borderColor: 'text.disabled',
              width: { xs: 60, md: 100 },
              height: { xs: 60, md: 100 },
              background: 'transparent',
            }}
          >
            <Iconify
              icon={'streamline-emojis:cat-face'}
              sx={{ width: { xs: 30, md: 60 }, height: { xs: 30, md: 60 } }}
            />
          </Avatar>
        </InfoStyle>

        <Divider sx={{ mt: 3, width: '87%', mx: 'auto' }} />

        <Stack spacing={2} sx={{ p: 3 }}>
          <Stack direction="row">
            <IconStyle icon={'ion:wallet-outline'} />
            <Typography variant="body2">
              Wallet: &nbsp;
              <Link
                href={`https://sepolia.basescan.org/address/${userData && userData.wallet}`}
                target="_blank"
                rel="noopener"
                style={{ textDecoration: 'none', fontWeight: 'bold', color: 'none' }}
              >
                {loadingUser ? (
                  <>......</>
                ) : (
                  <>{`${userData && userData.wallet.substr(0, 5)}...${userData && userData.wallet.substr(-5)}`}</>
                )}
                <Iconify icon={'majesticons:open'} sx={{ verticalAlign: 'middle', ml: 0.5 }} />
              </Link>
            </Typography>
          </Stack>

          <Stack direction="row">
            <IconStyle icon={'mdi:cards-playing-spade-multiple-outline'} />
            <Typography variant="body2">
              Total bets: <Label color="secondary">{loadingUser ? <>0</> : userData && userData.total_bets}</Label>
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </>
  );
}
