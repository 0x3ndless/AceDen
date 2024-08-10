import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container, Card, CardContent, Typography, Skeleton, Divider, Avatar, Tooltip, Link, Grid, Button, Dialog, DialogContent, DialogContentText, Box } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components 
import Page from '../components/Page';
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { getBetById, updateBet  } from "../redux/features/contractSlice";
import Iconify from '../components/Iconify';
import { useAccount } from 'wagmi';
import Label from '../components/Label';
import CancelBetDetails from './user/components/CancelBetDetails';
import useResponsive from '../hooks/useResponsive';
import Connect from './authentication/Connect';
import ConnectAuthorize from './authentication/ConnectAuthorize';
import OpposeBet from './user/components/OpposeBet';
//ABIS smart contract
import AceDenABIS from '../abis/AceDen.json';
//-----------------------Lottie
import Lottie from 'react-lottie';
import successAnimation from '../animations/success.json';
import loadingAnimation from '../animations/loading.json';

// ----------------------------------------------------------------------

const cryptoIds = {
    btc: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
    eth: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
    sol: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
  };
  
  const fetchCryptoPrice = async (crypto) => {
    if (!crypto) {
      return '....';
    }
  
    const id = cryptoIds[crypto];
  
    try {
      const response = await fetch(
        `https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=${id}&encoding=hex&parsed=true`
      );
      const data = await response.json();
  
      // Assume that the API returns an object with price information
      const priceInfo = data && data.parsed?.[0]?.price?.price;
      
      // Convert to a number and scale appropriately
      const updatedInfo = Number(priceInfo) / 100000000; // Adjust the divisor as needed
  
      // Format the number with commas and two decimal places
      return updatedInfo ? `$${updatedInfo.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Not Available';
    } catch (error) {
      console.error('Error fetching crypto price:', error);
      return 'Not Available';
    }
  };

export default function BetDetails() {

  //--------------------------------------------------------------

    // Lottie animation options for the different states
    const successAnimationOptions = {
      loop: true,
      autoplay: true,
      animationData: successAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };

    const loadingAnimationOptions = {
      loop: true,
      autoplay: true,
      animationData: loadingAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };

  let id = useParams().id;

  const isDesktop = useResponsive('up', 'md');

  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const ethers = require("ethers");
  const { loadingBetDetails, betDetails } = useSelector((state) => ({...state.app}));


  const { address, isConnected } = useAccount();
  const accessTokenExists = localStorage.getItem('access_token') !== null;

  const [currentTime, setCurrentTime] = useState(new Date());
  const [cryptoPrice, setCryptoPrice] = useState('Loading...'); // State for storing current price
  const [betDetailsChain, setBetDetailsChain] = useState(null);


  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState(`Please, sign the transaction...`);
  const [transaction, setTransaction] = useState('');
  const [count, setCount] = useState(10);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  function timeUntil(targetDateStr) {
    const now = currentTime;
    const targetDate = new Date(targetDateStr);
    const differenceInMillis = targetDate - now;

    if (differenceInMillis <= 0) {
      return { expired: true };
    }

    const totalMinutes = Math.floor(differenceInMillis / (1000 * 60));
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    return { expired: false, days, hours, minutes };
  }

  function formatTimeUntil(targetDateStr) {
    const { expired, days, hours, minutes } = timeUntil(targetDateStr);

    if (expired) {
      return 'Expired';
    }

    const dayStr = days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}` : '';
    const hourStr = hours > 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : '';
    const minuteStr = minutes > 0 ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` : '';
    const parts = [dayStr, hourStr, minuteStr].filter(part => part !== '').join(' & ');

    return parts || 'less than a minute';
  }


  const fetchLeaderBoard = () => {
    dispatch(getBetById({id}));
  }

  // Update price when cryptocurrency changes
  useEffect(() => {
    const updatePrice = async () => {
      const price = await fetchCryptoPrice(betDetails && betDetails[0] && betDetails[0]?.betContent?.assetType);
      setCryptoPrice(price);
    };

    updatePrice();
  }, [betDetails && betDetails[0] && betDetails[0]?.betContent?.assetType]);

  useEffect(() => {
    fetchLeaderBoard();
  }, []);


  const fetchBetDetails = async () => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, AceDenABIS, signer);

        const betID = betDetails && betDetails[0] && betDetails[0]?.betContent?.betId;

        const bet = await contract.bets(betID);
        setBetDetailsChain(bet);
    } catch (error) {
        console.error("Error fetching bet details:", error);
    }
  };


  // Fetch the bet details
  useEffect(() => {
      if (betDetails && betDetails[0] && betDetails[0]?.betContent?.betId) {
          fetchBetDetails();
      }
  }, [betDetails && betDetails[0] && betDetails[0]?.betContent?.betId]); 



    //-------------------------------------------------------------
    async function handleClaimReward(e) {

      e.preventDefault();
  
      try {
  
      setOpenMessage(true);
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, AceDenABIS, signer);
  
      const betID = betDetails && betDetails[0] && betDetails[0]?.betContent?.betId;
  
      setMessage('Please, sign the transaction...');
    
      const cancelBetOnChain = await contract.claimReward(betID);
  
      setMessage('Claiming reward on the blockchain...');
    
      const receipt = await cancelBetOnChain.wait();

      const betData = {
        isSettled: betDetailsChain?.isSettled,
        isDraw: betDetailsChain?.isDraw,
        creatorWins: betDetailsChain?.creatorWins,
        rewardClaimed: true,
      }
      
      setMessage('Almost done...');
      await dispatch(updateBet({betData, id}));
      setTransaction(receipt.transactionHash);
      setMessage('Reward claimed successfully!!');
  
      const intervalId = setInterval(() => {
          setCount((prevCountdown) => prevCountdown - 1);
      }, 1000);
    
      setTimeout(() => {
        clearInterval(intervalId);
        setOpenMessage(false);
        window.location.reload();
      }, count * 1000);
  
    } catch (error) {
      console.error("Error during reward claim:", error);
      setOpenMessage(false);
    }
    }




  return (
    <Page title="Bet">
      <Container maxWidth={themeStretch ? false : 'lg'}>


      <Dialog
        open={openMessage}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ sx: { width: 330 } }} 
      >
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            {message === 'Reward claimed successfully!!' ? (
              <>
                <Lottie options={successAnimationOptions} height={100} width={100} />
                <Typography variant="h6" sx={{mt: 1}}>Claimed successfully!!</Typography>
              </>
            ) :  (
              <>
                <Lottie options={loadingAnimationOptions} height={100} width={100} />
                <Typography variant="h6" sx={{mt: 1}}>Claiming (Do not close)</Typography>
              </>
            )}
          </Box>

          <DialogContentText id="alert-dialog-description">
            {message === 'Reward claimed successfully!!' ? `Pop-up will close in ${count} seconds` : message}
            {message === 'Reward claimed successfully!!' &&
            <>
            <br></br>
            <Link href={`https://sepolia.basescan.org/tx/${transaction}`} target="_blank" rel="noopener" style={{ textDecoration: 'none', fontWeight: 'bold' }} > View Txn<Iconify icon={'majesticons:open'} sx={{verticalAlign: 'middle', ml: 0.5}}/></Link>
            </>
            }
          </DialogContentText>

        </DialogContent>
      </Dialog>




        {(loadingBetDetails || betDetails === null) ? (
          <Card>
            <CardContent>
              <Skeleton variant="text" height={40} width="80%" />
              <Skeleton variant="text" height={20} width="60%" />
              <Skeleton variant="rectangular" height={100} />
            </CardContent>
          </Card>
        ) : (
          <Card sx={{boxShadow: 3, width: isDesktop ? '50%' : 'unset', margin: '0 auto', mt: 4}}>
            <CardContent sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }}>

            <Typography variant='h5' sx={{ mb: 1, textAlign: 'center' }}>
                $<span style={{textTransform: 'uppercase'}}>{betDetails && betDetails[0] && betDetails[0]?.betContent?.assetType}</span> Price Prediction Bet
            </Typography>

            <Divider sx={{ width: '100%', mb: 2 }} />

            <Avatar sx={{ border: '0.5px dotted', borderColor: 'text.secondary', background: 'transparent', width: 56, height: 56, }} >
                <Iconify icon={betDetails && betDetails[0] && betDetails[0]?.betContent?.assetType === 'btc' ? 'cryptocurrency-color:btc' : betDetails && betDetails[0] && betDetails[0]?.betContent?.assetType === 'eth' ? 'cryptocurrency-color:eth' : betDetails && betDetails[0] && betDetails[0]?.betContent?.assetType === 'sol' ? 'cryptocurrency-color:sol' : null} width={40} height={40} />
            </Avatar>

            <Typography sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
            <Tooltip title="Creator" placement="left">
                <Link href={`https://sepolia.basescan.org/address/${betDetails && betDetails[0] && betDetails[0]?.betContent?.creator}`} target="_blank" rel="noopener" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'none' }} >
                    <>{`${betDetails && betDetails[0] && betDetails[0]?.betContent?.creator?.substr(0, 4)}...${betDetails && betDetails[0] && betDetails[0]?.betContent?.creator?.substr(-4)}`}</>{betDetails && betDetails[0] && betDetails[0]?.betContent?.creator === address && "(Me)"}
                </Link>
            </Tooltip> 
                &nbsp;bets that the price of <span style={{ fontWeight: 'bold' }}>{betDetails && betDetails[0] && betDetails[0]?.betContent?.assetType.toUpperCase()}</span> will be {betDetails && betDetails[0] && betDetails[0]?.betContent?.creatorPrediction === 'bullish' ? 'above' : 'below'}{' '}
                <span style={{ fontWeight: 'bold' }}>${betDetails && betDetails[0] && betDetails[0]?.betContent?.targetPrice}</span> in the next <span style={{ fontWeight: 'bold' }}>{formatTimeUntil(betDetails && betDetails[0] && betDetails[0]?.betContent?.endTime)}</span>
            </Typography>

            <Typography variant='subtitle2' sx={{ mb: 3, textAlign: 'center' }}>
                <Label color='success'>
                Current Price: {cryptoPrice}
                </Label>
            </Typography>

            <Divider sx={{ width: '100%', mb: 2 }} />

            <Grid container sx={{ width: '100%', mb: 2 }}>
                <Grid item xs={6} sx={{ textAlign: 'left' }}>
                <Typography variant="subtitle1" >
                    Bet Amount
                </Typography>
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mt: 0.5, }} > <Iconify icon={'cryptocurrency-color:eth'} height={20} width={20} sx={{ mr: 0.5 }} /> {betDetails && betDetails[0] && betDetails[0]?.betContent?.bet_amount} ETH </Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Join Until
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 0.5, }}>{betDetails && betDetails[0] && betDetails[0]?.betContent?.opponent !== null ? '🔒' : formatTimeUntil(betDetails && betDetails[0] && betDetails[0]?.betContent?.joinUntil)}  </Typography>
                </Grid>
            </Grid>

            <Divider sx={{ width: '100%', mb: 2 }} />


            {betDetailsChain?.isSettled ? null :

              <>

                {!accessTokenExists && isConnected ? 
                    <ConnectAuthorize /> : !accessTokenExists || (!isConnected) ? <Connect /> 
                    : isConnected && accessTokenExists ?
                    <>
                    {betDetails && betDetails[0] && betDetails[0]?.betContent?.creator === address && betDetails[0]?.betContent?.opponent === null  ? 
                      <CancelBetDetails data={betDetails && betDetails[0] && betDetails[0]?.betContent} />
                      :
                      <>
                      {betDetails && betDetails[0] && betDetails[0]?.betContent?.opponent === null ?
                        <OpposeBet data={betDetails && betDetails[0] && betDetails[0]?.betContent} />
                        : betDetails && betDetails[0] && betDetails[0]?.betContent?.opponent !== null ?
                        <>
                        <Typography variant="subtitle1" sx={{textAlign: 'center'}}>
                          Opposed By
                        </Typography>
                        <Typography variant="subtitle2" sx={{textAlign: 'center' }}>
                            <Link href={`https://sepolia.basescan.org/address/${betDetails && betDetails[0] && betDetails[0]?.betContent?.opponent}`} target="_blank" rel="noopener" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'none' }} >
                                <>{`${betDetails && betDetails[0] && betDetails[0]?.betContent?.opponent?.substr(0, 4)}...${betDetails && betDetails[0] && betDetails[0]?.betContent?.opponent?.substr(-4)}`}</>{betDetails && betDetails[0] && betDetails[0]?.betContent?.opponent === address && "(Me)"}
                            </Link>
                        </Typography>
                        </>
                        :
                        null
                      }
                      </>
                    }
                    </>
                    : null
                }
                </>}

      
            {accessTokenExists && isConnected && betDetailsChain?.isSettled ? (
              address === betDetails[0]?.betContent?.opponent || address === betDetails[0]?.betContent?.creator ? (
                betDetailsChain?.rewardClaimed ? (
                  // If the reward is claimed
                  <>
                    {betDetailsChain?.creatorWins ? (
                      betDetails[0]?.betContent?.creator === address ? (
                        <Typography variant="h5" sx={{ textAlign: "center" }}>
                          Congratulations, You won!! 🎉
                        </Typography>
                      ) : (
                        <Typography variant="h5" sx={{ textAlign: "center" }}>
                          Oops, You lost!! 😭
                        </Typography>
                      )
                    ) : betDetails[0]?.betContent?.opponent === address ? (
                      <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Congratulations, You won!! 🎉
                      </Typography>
                    ) : (
                      <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Oops, You lost!! 😭
                      </Typography>
                    )}
                  </>
                ) : (
                  // If the bet is settled but the reward is not claimed
                  <>
                    {betDetailsChain?.creatorWins ? (
                      betDetails[0]?.betContent?.creator === address ? (
                        <>
                          <Typography variant="h5" sx={{ textAlign: "center" }}>
                            Congratulations, You won!! 🎉
                          </Typography>

                          <Button
                            startIcon={<Iconify icon="fluent-emoji-flat:party-popper" />}
                            variant="outlined"
                            sx={{ mt: 2 }}
                            onClick={handleClaimReward}
                          >
                            Claim {(betDetails[0]?.betContent?.bet_amount) * 2} ETH
                          </Button>
                        </>
                      ) : (
                        <Typography variant="h5" sx={{ textAlign: "center" }}>
                          Oops, You lost!! 😭
                        </Typography>
                      )
                    ) : betDetails[0]?.betContent?.opponent === address ? (
                      <>
                        <Typography variant="h5" sx={{ textAlign: "center" }}>
                          Congratulations, You won!! 🎉
                        </Typography>

                        <Button
                          startIcon={<Iconify icon="fluent-emoji-flat:party-popper" />}
                          variant="outlined"
                          sx={{ mt: 2 }}
                          onClick={handleClaimReward}
                        >
                          Claim {(betDetails[0]?.betContent?.bet_amount) * 2} ETH
                        </Button>
                      </>
                    ) : (
                      <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Oops, You lost!! 😭
                      </Typography>
                    )}
                  </>
                )
              ) : (
                // For other viewers, show who won the bet
                <>
                  {betDetailsChain?.creatorWins ? (
                    <Typography variant="h6" sx={{ textAlign: "center" }}>
                      Won by Creator 👑<br></br>
                      <Link href={`https://sepolia.basescan.org/address/${betDetails && betDetails[0] && betDetails[0]?.betContent?.creator}`} target="_blank" rel="noopener" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'none' }} >
                        <>{`${betDetails && betDetails[0] && betDetails[0]?.betContent?.creator?.substr(0, 4)}...${betDetails && betDetails[0] && betDetails[0]?.betContent?.creator?.substr(-4)}`}</>{betDetails && betDetails[0] && betDetails[0]?.betContent?.creator === address && "(Me)"}
                      </Link>
                    </Typography>
                  ) : (
                    <Typography variant="h6" sx={{ textAlign: "center" }}>
                      Won by Opposer 👑<br></br>
                      <Link href={`https://sepolia.basescan.org/address/${betDetails && betDetails[0] && betDetails[0]?.betContent?.opponent}`} target="_blank" rel="noopener" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'none' }} >
                        <>{`${betDetails && betDetails[0] && betDetails[0]?.betContent?.opponent?.substr(0, 4)}...${betDetails && betDetails[0] && betDetails[0]?.betContent?.opponent?.substr(-4)}`}</>{betDetails && betDetails[0] && betDetails[0]?.betContent?.opponent === address && "(Me)"}
                      </Link>
                    </Typography>
                  )}
                </>
              )
            ) : null}




            </CardContent>
          </Card>
        )}
      </Container>
    </Page>
  );
}