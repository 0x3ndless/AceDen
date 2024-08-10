import React, { useState } from 'react';
import { Button, Dialog, DialogContent, DialogContentText, Box, Typography, Link } from '@mui/material';
import Iconify from '../../../components/Iconify';
//Redux
import { useDispatch } from 'react-redux';
import { removeBet } from "../../../redux/features/contractSlice";
//ABIS smart contract
import AceDenABIS from '../../../abis/AceDen.json';
//-----------------------Lottie
import Lottie from 'react-lottie';
import successAnimation from '../../../animations/success.json';
import loadingAnimation from '../../../animations/loading.json';
import { useNavigate } from 'react-router';


const CancelBetDetails = ({data}) => {

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

    const [openMessage, setOpenMessage] = useState(false);
    const [message, setMessage] = useState(`Please, sign the transaction...`);
    const [transaction, setTransaction] = useState('');
    const [count, setCount] = useState(10);


    //-------------------------------------------------------------
  async function handleCancelBet(e) {

    e.preventDefault();

    try {

    setOpenMessage(true);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, AceDenABIS, signer);

    const betID = data?.betId;

    setMessage('Please, sign the transaction...');
  
    const cancelBetOnChain = await contract.cancelBet(betID);

    setMessage('Cancelling a bet on the blockchain...');
  
    const receipt = await cancelBetOnChain.wait();
    
    setMessage('Almost done...');
    await dispatch(removeBet({id: data?._id}));
    setTransaction(receipt.transactionHash);
    setMessage('Bet cancelled successfully!!');

    const intervalId = setInterval(() => {
        setCount((prevCountdown) => prevCountdown - 1);
    }, 1000);
  
    setTimeout(() => {
      clearInterval(intervalId);
      setOpenMessage(false);
      navigate('/profile')
    }, count * 1000);

  } catch (error) {
    console.error("Error during cancelling a bet:", error);
    setOpenMessage(false);
  }
  }




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
            {message === 'Bet cancelled successfully!!' ? (
              <>
                <Lottie options={successAnimationOptions} height={100} width={100} />
                <Typography variant="h6" sx={{mt: 1}}>Cancelled successfully!!</Typography>
              </>
            ) :  (
              <>
                <Lottie options={loadingAnimationOptions} height={100} width={100} />
                <Typography variant="h6" sx={{mt: 1}}>Cancelling (Do not close)</Typography>
              </>
            )}
          </Box>

          <DialogContentText id="alert-dialog-description">
            {message === 'Bet cancelled successfully!!' ? `Pop-up will close in ${count} seconds` : message}
            {message === 'Bet cancelled successfully!!' &&
            <>
            <br></br>
            <Link href={`https://sepolia.basescan.org/tx/${transaction}`} target="_blank" rel="noopener" style={{ textDecoration: 'none', fontWeight: 'bold' }} > View Txn<Iconify icon={'majesticons:open'} sx={{verticalAlign: 'middle', ml: 0.5}}/></Link>
            </>
            }
          </DialogContentText>

        </DialogContent>
      </Dialog>

    {data?.opponent === null ? 
        <Button onClick={handleCancelBet} variant="outlined" color='error' sx={{ mb: 2 }} disabled={openMessage === true ? true : false}>
            Cancel Bet
        </Button>
    : 
      <Button disabled variant="outlined" sx={{ mb: 2 }}>
        Loading...
      </Button>
      }
    
    </>
  )
}

export default CancelBetDetails