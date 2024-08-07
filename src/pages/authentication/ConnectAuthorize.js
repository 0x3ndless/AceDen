import React, { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Button, Dialog, DialogTitle, DialogContent, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { signMessage } from '@wagmi/core';
import Iconify from '../../components/Iconify';
import useResponsive from '../../hooks/useResponsive';
import Lottie from 'react-lottie';
import loadingAnimation from '../../animations/loading.json';
import failedAnimation from '../../animations/failed.json';

export default function ConnectAuthorize() {


  //--------------------------------------------------------------
    const loadingAnimationOptions = {
      loop: true,
      autoplay: true,
      animationData: loadingAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };

    const failedAnimationOptions = {
      loop: true,
      autoplay: true,
      animationData: failedAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };

  
  var currentWallet = localStorage.getItem('wagmi.wallet');
  var parsedWallet = JSON.parse(currentWallet);
  

  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const isDesktop = useResponsive('up', 'md');

  //---------------------------------------State ------------------------------------------------------
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    disconnect()
    localStorage.clear();
    setOpen(false)
  };

  //---------------Message State -------------------
  const [message, setMessage] = useState('Awaiting Confirmation');
  const [message2, setMessage2] = useState('Sign the signature request in your wallet');
  //------------------------------------------------

  //------------------------------------------------------------------------------------------------------



  const authencticate = async () => {

    try {

      setOpen(true);

    let header = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }
    let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/nonce?address=${address}`, header); //getting the nonce from the backend
    let resBody = res.data;


    const ethers = require("ethers");

    if((parsedWallet !== null || undefined) && parsedWallet === 'metaMask') {
      var provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      var signature = await signer.signMessage(resBody.message)
    } 

    if((parsedWallet !== null || undefined) && parsedWallet === 'walletConnect') {
      const messageSigner = resBody.message;
      var signature = await signMessage({message: messageSigner})
    }

    if((parsedWallet !== null || undefined) && parsedWallet === 'coinbaseWallet') {
      const messageSigner = resBody.message;
      var signature = await signMessage({message: messageSigner})
    }

   
    
    
    let opts = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resBody.tempToken}`
        }
    }

    res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/verify?signature=${signature}`, {}, opts);
    resBody = res.data;


    //Create user

    var postData = {
      wallet: address,
      wallet_type: 'external',
    };
    
    let axiosConfig = {
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
      }
    };
    
    if(address !== null) {
    axios.post(`${process.env.REACT_APP_API_URL}/api/users`, postData, axiosConfig)
    .then((res) => {
       //local storage remove 24hrs
        var now = new Date().getTime();
        const item = {
          token: resBody.token,
          wallet: address,
          wallet_type: 'external',
          expiry: now,
        }
        localStorage.setItem('access_token', JSON.stringify(item));
        setOpen(false)
        window.location.reload();
    })
    .catch((err) => {
      //local storage remove 24hrs
      var now = new Date().getTime();
      const item = {
        token: resBody.token,
        wallet: address,
        wallet_type: 'external',
        expiry: now,
      }
      localStorage.setItem('access_token', JSON.stringify(item));
      setOpen(false);
      window.location.reload();
    })}

  } catch (e) {
    console.log(e);
    setMessage('Failed To Sign In');
    setMessage2('Signature request reset. Please try again.')
  }
    
}

  return (
    <>

    <Dialog open={open} onClose={handleClose} sx={{minWidth: isDesktop ? '340px' : null}} >

    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        Sign In
        <Button onClick={handleClose} sx={{ minWidth: 0 }}>
          <Iconify icon="ic:sharp-close" sx={{ color: 'text.disabled' }} height={22} width={22} />
        </Button>
    </DialogTitle>





      <DialogContent sx={{ minWidth: isDesktop ? '340px' : '300px'}}>
      <Stack sx={{ p: 1 }}>

        <>

        {message === 'Failed To Sign In' ? 
          <Lottie options={failedAnimationOptions} height={70} width={70} />
          :
          <Lottie options={loadingAnimationOptions} height={80} width={80} />
        }

        <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
          {message}
        </Typography>

        <Typography variant="body2" sx={{ textAlign: 'center', mb: 2, color: 'text.secondary' }}>
          {message2}
        </Typography>
        
        </>
                  
          </Stack>
        </DialogContent>
    </Dialog>


    <Button variant="outlined" startIcon={<Iconify icon="line-md:edit"/>} onClick={authencticate}>
      Sign Message
    </Button>

    </>
  );
}
