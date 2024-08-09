import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


//localstorage get access token
const local_access_token = localStorage.getItem('access_token');
const access_token = JSON.parse(local_access_token);
//----------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------

//Get current user's data

export const getUserData = createAsyncThunk("contract/getUserData", async () => {
    return fetch(`${process.env.REACT_APP_API_URL}/api/users/me`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
            'Authorization': `Bearer ${access_token.token}`,
        },
    }).then((res) => 
    res.json()
    );
})


//Get active bets by the user
export const getActiveBetsUser = createAsyncThunk("contract/getActiveBetsUser", async () => {
    return fetch(`${process.env.REACT_APP_API_URL}/api/bet/me/active`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
            'Authorization': `Bearer ${access_token.token}`,
        },
    }).then((res) => 
    res.json()
    );
})


//Get completed bets by the user
export const getCompletedBetsUser = createAsyncThunk("contract/getCompletedBetsUser", async () => {
    return fetch(`${process.env.REACT_APP_API_URL}/api/bet/me/completed`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
            'Authorization': `Bearer ${access_token.token}`,
        },
    }).then((res) => 
    res.json()
    );
})



//------------------------------------Leaderboard ------------------------------------------
//Get leaderboard lists
export const getLeaderBoardData = createAsyncThunk("contract/getLeaderBoardData", async () => {
    return fetch(`${process.env.REACT_APP_API_URL}/api/users/leaderboard`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        },
    }).then((res) => 
    res.json()
    );
})

//-----------------------------------------------------------------------------------------------------


//--------------------------------------Bet-----------------------------------------------


//Get bet details using ID
export const getBetById = createAsyncThunk("contract/getBetById", async ({id}) => {
    return fetch(`${process.env.REACT_APP_API_URL}/api/bet/${id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        },
    }).then((res) => 
    res.json()
    );
})


//---------------------------------General Bet calls --------------------------
    //Get all active bet lists
    export const getAllBets = createAsyncThunk("contract/getAllBets", async () => {
        return fetch(`${process.env.REACT_APP_API_URL}/api/bet/all/active`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
        }).then((res) => 
        res.json()
        );
    });

//-------------------------------------------------Bet CRUD--------------------------------------------------------

    //Post request for creating a bet
    export const createBet = createAsyncThunk("contract/createBet", async ({betData}) => {
        return fetch(`${process.env.REACT_APP_API_URL}/api/bet/new`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
                'Authorization': `Bearer ${access_token.token}`,
            },
            body: JSON.stringify({
                betId: betData.betId,
                bet_amount: betData.bet_amount,
                targetPrice: betData.targetPrice,
                endTime: betData.endTime,
                joinUntil: betData.joinUntil,
                creatorPrediction: betData.creatorPrediction,
                assetType: betData.assetType,
            })
        }).then((res) => 
        res.json()
        );
    })

    //Remove certain listing 
    export const removeBet = createAsyncThunk("contract/removeBet", async ({id}) => {
        return fetch(`${process.env.REACT_APP_API_URL}/api/bet/delete/${id}/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
                'Authorization': `Bearer ${access_token.token}`
            },
        }).then((res) => 
        res.json()
        );
    });

    //Update bet details
    export const updateBet = createAsyncThunk("contract/updateBet", async ({betData, id}) => {
        return fetch(`${process.env.REACT_APP_API_URL}/api/bet/update/${id}/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
                'Authorization': `Bearer ${access_token.token}`
            },
            body: JSON.stringify({
                isSettled: betData.isSettled,
                isDraw: betData.isDraw,
                creatorWins: betData.creatorWins,
                rewardClaimed: betData.rewardClaimed,
            })
        }).then((res) => 
        res.json()
        );
    });

//-------------------------------------------------------------------------------------------------------------------

//-------------------------------------------Join Bet----------------------------------------------------------------

// Join Bet
    export const joinBet = createAsyncThunk("contract/joinBet", async ({id}) => {
        return fetch(`${process.env.REACT_APP_API_URL}/api/bet/join/${id}/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
                'Authorization': `Bearer ${access_token.token}`
            }
        }).then((res) => 
        res.json()
        );
    });


//-------------------------------------------------------------------------------------------------------------------


const contractSlice = createSlice({
    name: "contract",
    initialState: {
        //User states
        error: null,
        userData: [], //user details 
        userBetDataActive: [],
        userBetDataCompleted: [],
        loading: false,
        loadingUser: false,
        loadingUserBet: false,
        loadingUserDetails: false,

        //Leaderboard states
        leaderBoardData: [],
        loadingLeaderBoard: false,
        
        
        //Bet states
        betDetails: null, //bet details
        loadingBetDetails: false,

        
        //---------------------General Bet states-----------------------
        loadingBet: false,
        allBets: [],
        //--------------------------------------------
    

        //Market states
        loadingBettingDetails: false,
        bettingDetails: null, //listing details
        loadingUpdateBetting: false,

    },


    extraReducers: {


        //get users data
        [getUserData.pending]: (state, action) => {
            state.loadingUser = true;
        },
        [getUserData.fulfilled]: (state, action) => {
            state.loadingUser = false;
            state.userData = [action.payload];
        },
        [getUserData.rejected]: (state, action) => {
            state.loadingUser = false;
            state.error = action.payload;
        },

        //get active bet by user
        [getActiveBetsUser.pending]: (state, action) => {
            state.loadingUserBet = true;
        },
        [getActiveBetsUser.fulfilled]: (state, action) => {
            state.loadingUserBet = false;
            state.userBetDataActive = [action.payload];
        },
        [getActiveBetsUser.rejected]: (state, action) => {
            state.loadingUserBet = false;
            state.error = action.payload;
        },

        //get completed bet by user
        [getCompletedBetsUser.pending]: (state, action) => {
            state.loadingUserBet = true;
        },
        [getCompletedBetsUser.fulfilled]: (state, action) => {
            state.loadingUserBet = false;
            state.userBetDataCompleted = [action.payload];
        },
        [getCompletedBetsUser.rejected]: (state, action) => {
            state.loadingUserBet = false;
            state.error = action.payload;
        },


        //get leaderboard list
        [getLeaderBoardData.pending]: (state, action) => {
            state.loadingLeaderBoard = true;
        },
        [getLeaderBoardData.fulfilled]: (state, action) => {
            state.loadingLeaderBoard = false;
            state.leaderBoardData = [action.payload];
        },
        [getLeaderBoardData.rejected]: (state, action) => {
            state.loadingLeaderBoard = false;
            state.error = action.payload;
        },


        //get bet by Id
        [getBetById.pending]: (state, action) => {
            state.loadingBetDetails = true;
        },
        [getBetById.fulfilled]: (state, action) => {
            state.loadingBetDetails = false;
            state.betDetails = [action.payload];
        },
        [getBetById.rejected]: (state, action) => {
            state.loadingBetDetails = false;
            state.error = action.payload;
        },

        //get all bet list 
        [getAllBets.pending]: (state, action) => {
            state.loadingBet = true;
        },
        [getAllBets.fulfilled]: (state, action) => {
            state.loadingBet = false;
            state.allBets = [action.payload];
        },
        [getAllBets.rejected]: (state, action) => {
            state.loadingBet = false;
            state.error = action.payload;
        },

        //create new bet
        [createBet.pending]: (state, action) => {
            state.loadingBettingDetails = true;
        },
        [createBet.fulfilled]: (state, action) => {
            state.loadingBettingDetails = false;
            state.bettingDetails = action.payload;
        },
        [createBet.rejected]: (state, action) => {
            state.loadingBettingDetails = false;
            state.error = action.payload;
        },

        //Remove bet
        [removeBet.pending]: (state, action) => {
            state.loadingUpdateBetting = true;
        },
        [removeBet.fulfilled]: (state, action) => {
            state.loadingUpdateBetting = false;
            state.bettingDetails = [action.payload];
        },
        [removeBet.rejected]: (state, action) => {
            state.loadingUpdateBetting = false;
            state.error = action.payload;
        },

        //Update bet details
        [updateBet.pending]: (state, action) => {
            state.loadingUpdateBetting = true;
        },
        [updateBet.fulfilled]: (state, action) => {
            state.loadingUpdateBetting = false;
            state.bettingDetails = [action.payload];
        },
        [updateBet.rejected]: (state, action) => {
            state.loadingUpdateBetting = false;
            state.error = action.payload;
        },

        //Join bet
        [joinBet.pending]: (state, action) => {
            state.loadingUpdateBetting = true;
        },
        [joinBet.fulfilled]: (state, action) => {
            state.loadingUpdateBetting = false;
            state.bettingDetails = [action.payload];
        },
        [joinBet.rejected]: (state, action) => {
            state.loadingUpdateBetting = false;
            state.error = action.payload;
        },

    }
})


export default contractSlice.reducer;