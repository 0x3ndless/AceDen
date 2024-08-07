import React, { useState } from 'react';
import Iconify from '../../components/Iconify';
import { Box, Button, Card, Divider, Grid, InputAdornment, InputLabel, MenuItem, FormControl, Select, Stack, TextField, Typography } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'; 
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch } from 'react-redux';

const BetForm = () => {

  const dispatch = useDispatch();

  // States
  const [formData, setFormData] = useState({ target_price: '', bet_amount: '' });
  const [open, setOpen] = useState(false);
  const [predictionType, setPredictionType] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState(''); // State for selected cryptocurrency
  const [cryptoPrice, setCryptoPrice] = useState(''); // State for storing current price

  // Date/time states
  const [betEnds, setBetEnds] = useState(null);
  const [joinUntil, setJoinUntil] = useState(null);

  // Function to fetch and set current price based on selected cryptocurrency
  const fetchCryptoPrice = (crypto) => {
    // Example: Fetch current price from an API
    // You should replace this with actual API call logic
    const prices = {
      btc: '$54,230',
      eth: '$1,850',
      sol: '$20'
    };
    return prices[crypto] || 'Not Available';
  };

  // Handle Prediction type
  const handleChangeMetadata = (event) => {
    setPredictionType(event.target.value);
  };

  // Function to convert date to seconds
  const dateToSeconds = (date) => {
    return date ? Math.floor(date.getTime() / 1000) : null;
  };

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

  // Update price when cryptocurrency changes
  React.useEffect(() => {
    setCryptoPrice(fetchCryptoPrice(selectedCrypto));
  }, [selectedCrypto]);

  return (
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
                    <DateTimePicker
                      label="Bet ends"
                      value={betEnds}
                      onChange={handleBetEndsChange}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      minDateTime={new Date()} 
                    />
                    <DateTimePicker
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
                      inputProps: { min: 1 },
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
                  type="submit"
                  variant="contained"
                  size='large'
                  onClick={() => {
                    const betEndsInSeconds = dateToSeconds(betEnds);
                    const joinUntilInSeconds = dateToSeconds(joinUntil);
                    console.log('Selected Crypto:', selectedCrypto);
                    console.log('Bet Ends:', betEndsInSeconds, 'Join Until:', joinUntilInSeconds);
                    // Dispatch your redux action here
                  }}
                >
                  Create Bet
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </LocalizationProvider>
  );
};

export default BetForm;
