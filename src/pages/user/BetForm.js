import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../components/Iconify';
import Label from '../../components/Label';
import { Box, Button, Card, Divider, Grid, InputAdornment, InputLabel, MenuItem, FormControl, Select, Stack, TextField, Typography, Link, Dialog, DialogContent, DialogContentText, Avatar } from '@mui/material';
import { MobileDateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
//Redux
import { useDispatch } from 'react-redux';
import { createBet, getUserData } from "../../redux/features/contractSlice";
//ABIS smart contract
import AceDenABIS from '../../abis/AceDen.json';
//-----------------------Lottie
import Lottie from 'react-lottie';
import successAnimation from '../../animations/success.json';
import loadingAnimation from '../../animations/loading.json';
import ConfettiExplosion from 'react-confetti-explosion';

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


const BetForm = () => {

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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ethers = require("ethers");

  // States
  const [formData, setFormData] = useState({ target_price: '', bet_amount: '' });
  const [, setOpen] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [message, setMessage] = useState(`Please, sign the transaction...`);
  const [transaction, setTransaction] = useState('');
  const [count, setCount] = useState(10);
  const [predictionType, setPredictionType] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState(''); // State for selected cryptocurrency
  const [cryptoPrice, setCryptoPrice] = useState('Loading...'); // State for storing current price

  // Date/time states
  const [betEnds, setBetEnds] = useState(null);
  const [joinUntil, setJoinUntil] = useState(null);

  // Handle Prediction type
  const handleChangeMetadata = (event) => {
    setPredictionType(event.target.value);
  };

  // Function to convert date to seconds
  const dateToSeconds = (date) => {
    return date ? Math.floor(date.getTime() / 1000) : null;
  };

  function timeUntil(targetDateStr) {
    // Get the current date and time
    const now = new Date();

    // Create a Date object for the target date
    const targetDate = new Date(targetDateStr);

    // Calculate the difference in milliseconds
    const differenceInMillis = targetDate - now;

    // Convert milliseconds to total minutes
    const totalMinutes = Math.floor(differenceInMillis / (1000 * 60));

    // Calculate days, hours, and remaining minutes
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    return { days, hours, minutes };
  }

  function formatTimeUntil(targetDateStr) {
    const { days, hours, minutes } = timeUntil(targetDateStr);

    const dayStr = days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}` : '';
    const hourStr = hours > 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : '';
    const minuteStr = minutes > 0 ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` : '';

    // Combine parts with commas, excluding any empty parts
    const parts = [dayStr, hourStr, minuteStr].filter(part => part !== '').join(' & ');

    return parts || 'less than a minute'; // Fallback in case all parts are zero
}

  // Handle bet end date/time change
  const handleBetEndsChange = (newValue) => {
    setBetEnds(newValue);
    if (newValue && joinUntil && newValue < joinUntil) {
      setJoinUntil(null); // Reset joinUntil if it's after betEnds
    }
  };

  // Handle join until date/time change
  const handleJoinUntilChange = (newValue) => {
    if (!betEnds || (betEnds && newValue <= betEnds)) {
      setJoinUntil(newValue);
    }
  };

  //handle Preview
  const handleClickOpenPreview = () => {
    setOpenPreview(true);
  }

  const handleClickClosePreview = () => {
    setOpenPreview(false);
  }

  //handle state change
  const handleStateChange = () => {
    setFormData({target_price: '', bet_amount: ''});
    setPredictionType('');
    setSelectedCrypto('');
    setCryptoPrice('Loading...');
    setBetEnds(null);
    setJoinUntil(null);
  }

  //-------------------------------------------------------------
  async function handleCreateBet(e) {

    e.preventDefault();

    try {

    setOpenPreview(false);
    setOpenMessage(true);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, AceDenABIS, signer);
  
    const targetPrice = Number(formData.target_price + '00000000');
    const betEndsInSeconds = dateToSeconds(betEnds)
    const prediction = predictionType === 'bullish' ? 0 : 1;
    const assetType = selectedCrypto === 'btc' ? 0 : selectedCrypto === 'eth' ? 1 : 2;
    const betAmount = Number(formData.bet_amount);
    const betAmountInWei = ethers.utils.parseEther(betAmount.toString());

    setMessage('Please, sign the transaction...');
  
    const createBetOnChain = await contract.createBet(targetPrice, betEndsInSeconds, prediction, assetType, {value: betAmountInWei});

    setMessage('Creating a bet on the blockchain...');
  
    const receipt = await createBetOnChain.wait();
    const BetCreatedEvent = receipt.events.find((event) => event.event === 'BetCreated');
    const getBetID = BetCreatedEvent.args[0];
    const betID = getBetID.toNumber();
  
    const betData = {
      betId: betID,
      bet_amount: Number(formData.bet_amount),
      targetPrice: Number(formData.target_price),
      endTime: betEnds,
      joinUntil: joinUntil,
      creatorPrediction: predictionType,
      assetType: selectedCrypto,
    };
  
    setMessage('Almost done...');
    await dispatch(createBet({ betData }));
    await dispatch(getUserData());
    setTransaction(receipt.transactionHash);
    setMessage('Bet created successfully!!');
  
    const intervalId = setInterval(() => {
      setCount((prevCountdown) => prevCountdown - 1);
    }, 1000);
  
    handleStateChange();
    setTimeout(() => {
      clearInterval(intervalId);
      setOpenMessage(false);
      navigate('/profile');
    }, count * 1000);

  } catch (error) {
    console.error("Error during creating a bet:", error);
    handleStateChange();
    setOpenMessage(false);
  }
  }

  // Update price when cryptocurrency changes
  useEffect(() => {
    const updatePrice = async () => {
      const price = await fetchCryptoPrice(selectedCrypto);
      setCryptoPrice(price);
    };

    updatePrice();
  }, [selectedCrypto]);

  return (
  <>
    <Dialog
        open={openMessage}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ sx: { width: 330 } }} 
      >
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            {message === 'Bet created successfully!!' ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                  <ConfettiExplosion zIndex={1500} duration={4200} />
                </div>  
                <Lottie options={successAnimationOptions} height={100} width={100} />
                <Typography variant="h6" sx={{mt: 1}}>Created successfully!! 🎉</Typography>
              </>
            ) :  (
              <>
                <Lottie options={loadingAnimationOptions} height={100} width={100} />
                <Typography variant="h6" sx={{mt: 1}}>Creating (Do not close)</Typography>
              </>
            )}
          </Box>

          <DialogContentText id="alert-dialog-description">
            {message === 'Bet created successfully!!' ? `Pop-up will close in ${count} seconds` : message}
            {message === 'Bet created successfully!!' &&
            <>
            <br></br>
            <Link href={`https://sepolia.basescan.org/tx/${transaction}`} target="_blank" rel="noopener" style={{ textDecoration: 'none', fontWeight: 'bold' }} > View Txn<Iconify icon={'majesticons:open'} sx={{verticalAlign: 'middle', ml: 0.5}}/></Link>
            </>
            }
          </DialogContentText>

        </DialogContent>
      </Dialog>


      <Dialog
        open={openPreview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={handleClickClosePreview}
      >
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }}>

      <Typography variant='h5' sx={{ mb: 1, textAlign: 'center' }}>
        Preview
      </Typography>

      <Divider sx={{ width: '100%', mb: 2 }} />
         
      <Avatar sx={{ border: '0.5px dotted', borderColor: 'text.secondary', background: 'transparent', width: 56, height: 56, }} >
        <Iconify icon={selectedCrypto === 'btc' ? 'cryptocurrency-color:btc' : selectedCrypto === 'eth' ? 'cryptocurrency-color:eth' : selectedCrypto === 'sol' ? 'cryptocurrency-color:sol' : null} width={40} height={40} />
      </Avatar>
      
      <Typography sx={{ mt: 2, mb: 1, textAlign: 'center' }}>
          I bet that the price of <span style={{ fontWeight: 'bold' }}>{selectedCrypto.toUpperCase()}</span> will be {predictionType === 'bullish' ? 'above' : 'below'}{' '}
          <span style={{ fontWeight: 'bold' }}>${formData.target_price}</span> in the next <span style={{ fontWeight: 'bold' }}>{formatTimeUntil(betEnds)}</span>
      </Typography>

      <Typography variant='subtitle2' sx={{ mb: 2, textAlign: 'center' }}>
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
          <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mt: 0.5, }} > <Iconify icon={'cryptocurrency-color:eth'} height={20} width={20} sx={{ mr: 0.5 }} /> {formData.bet_amount} ETH </Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Ends In
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 0.5, }}>{formatTimeUntil(betEnds)}  </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ width: '100%', mb: 2 }} />

      <Button onClick={handleCreateBet} variant="contained" size='large' disabled={openMessage === true ? true : false}> 
        Create Bet 
      </Button>
          </Box>
        </DialogContent>
      </Dialog>

    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Card sx={{ p: 3 }}>
                
              <Grid container spacing={2}>

                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    Select an Asset to Bet On
                  </Typography>
                </Grid>

                {/* Cryptocurrency Selection */}
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Card
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        border: selectedCrypto === 'btc' ? '2px solid #2065D1' : '1px solid #ddd',
                        flex: 1,
                        textAlign: 'center'
                      }}
                      onClick={() => setSelectedCrypto('btc')}
                    >
                      <Iconify icon="cryptocurrency-color:btc" height={40} width={40} />
                      <Typography variant="h6">BTC</Typography>
                    </Card>
                    <Card
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        border: selectedCrypto === 'eth' ? '2px solid #2065D1' : '1px solid #ddd',
                        flex: 1,
                        textAlign: 'center'
                      }}
                      onClick={() => setSelectedCrypto('eth')}
                    >
                      <Iconify icon="cryptocurrency-color:eth" height={40} width={40} />
                      <Typography variant="h6">ETH</Typography>
                    </Card>
                    <Card
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        border: selectedCrypto === 'sol' ? '2px solid #2065D1' : '1px solid #ddd',
                        flex: 1,
                        textAlign: 'center'
                      }}
                      onClick={() => setSelectedCrypto('sol')}
                    >
                      <Iconify icon="cryptocurrency-color:sol" height={40} width={40} />
                      <Typography variant="h6">SOL</Typography>
                    </Card>
                  </Stack>

                  
                {/* Current Price Display */}
                <Grid item xs={12} sx={{mt: 2.5}}>
                  <Typography variant="subtitle1" align="center">
                    {selectedCrypto ? `Current ${selectedCrypto.toUpperCase()} Price: ${cryptoPrice}` : 'Select a cryptocurrency to see the current price'}
                  </Typography>
                </Grid>

                  <Divider sx={{ mb: 2, mt: 2.5 }} />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Iconify icon="mdi:dollar" height={20} width={20}/></InputAdornment>,
                      inputProps: { min: 1 },
                    }}
                    type='number'
                    required
                    placeholder="1000"
                    id="target_price"
                    label="Target Price"
                    variant="outlined"
                    fullWidth
                    autoComplete="off"
                    onChange={(e) => setFormData({ ...formData, target_price: e.target.value })}
                    value={formData.target_price}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Box>
                    <FormControl fullWidth required>
                      <InputLabel>Prediction</InputLabel>
                      <Select
                        labelId="predictionType"
                        id="predictionType"
                        value={predictionType}
                        label="Prediction"
                        onChange={handleChangeMetadata}
                      >
                        <MenuItem value={'bullish'} onClick={() => setOpen(true)}>
                          📈 Bullish (Price will be higher)
                        </MenuItem>
                        <MenuItem value={'bearish'} onClick={() => setOpen(true)}>
                          📉 Bearish (Price will be lower)
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Stack spacing={2}>
                    <MobileDateTimePicker
                      label="Bet ends"
                      value={betEnds}
                      onChange={handleBetEndsChange}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      minDateTime={new Date()} 
                    />
                    <MobileDateTimePicker
                      label="Join until"
                      value={joinUntil}
                      onChange={handleJoinUntilChange}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      minDateTime={new Date()}
                      maxDateTime={betEnds || new Date()} 
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ mb: 3, mt: 1 }} />
                  <TextField
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Iconify icon="cryptocurrency-color:eth" height={23} width={23}/></InputAdornment>,
                      inputProps: { min: '0.0001', step: '0.0001' },
                    }}
                    type='number'
                    required
                    placeholder="0.1"
                    id="bet_amount"
                    label="Bet Amount"
                    variant="outlined"
                    fullWidth
                    autoComplete="off"
                    onChange={(e) => setFormData({ ...formData, bet_amount: e.target.value })}
                    value={formData.bet_amount}
                  />
                </Grid>

              </Grid>

              <Divider sx={{ mb: 2.5, mt: 2.5 }} />

              <Stack spacing={3} alignItems="center">
                <Button
                  onClick={handleClickOpenPreview}
                  variant="contained"
                  size='large'
                  disabled={openPreview || openMessage || formData.target_price === '' || (formData.bet_amount === '' || Number(formData.bet_amount) === 0)  || predictionType === '' || selectedCrypto === '' || betEnds == null || joinUntil == null}
                >
                  Preview
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </LocalizationProvider>
    </>
  );
};

export default BetForm;