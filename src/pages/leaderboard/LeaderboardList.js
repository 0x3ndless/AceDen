import React from 'react';
import { useSelector } from 'react-redux';

//components
import Scrollbar from '../../components/Scrollbar';
import EmptyContent from '../../components/EmptyContent';

//MUI
import {
  Card,
  Typography,
  Table,
  Divider,
  TableBody,
  TableContainer,
  TableRow, TableCell, TableHead, Link, Tooltip
} from '@mui/material';




const LeaderboardList = ({leaderBoardData}) => {

  const { userData } = useSelector((state) => ({...state.app}));

  return (
    <>

    <Card> 
        <Divider />
          <Scrollbar>
            <TableContainer>
            {leaderBoardData && leaderBoardData.length > 0 ? 
              <Table>
              <TableHead>
              
              <TableRow>

                    <TableCell align="center">
                       Rank
                    </TableCell>

                    <TableCell>
                       User
                    </TableCell>

                    <TableCell >
                       Total bets
                    </TableCell>

                </TableRow>

                </TableHead>

                      <TableBody>

                      {leaderBoardData && leaderBoardData.length > 0 && leaderBoardData.map((item, index) => (
                        <TableRow hover align="center" sx={{ backgroundColor: userData && item.wallet === userData[0]?.wallet ? '#f4f6f8' : 'unset' }}>


                            <TableCell align="center">
                            <Typography variant="subtitle2" noWrap>
                              {item.rank === 1 ? <>🥇</> : item.rank === 2 ? <>🥈</> : item.rank === 3 ? <>🥉</> : null}  {item.rank} 
                            </Typography>
                            </TableCell>

                            <TableCell sx={{ display: 'flex', alignItems: 'center' }} align="center">
                              <Typography variant="subtitle2" noWrap >
                                <Tooltip title="User Address" placement="right">
                                <Link href={`https://base-sepolia.blockscout.com/address/${item.wallet}`} target="_blank" rel="noopener" style={{textDecoration: 'none', fontWeight: 'bold', color: 'none'}}>
                                {item.wallet.substr(0, 4)}...{item.wallet.substr(-4)} {userData && item.wallet === userData[0]?.wallet && "(Me)"}
                                </Link>
                                </Tooltip>
                              </Typography>
                            </TableCell>

                            <TableCell >
                            <Typography variant="subtitle2" noWrap>
                               {item.total_bets}
                            </Typography>
                            </TableCell>

                           
                        </TableRow>
                         ))}
            
              
                </TableBody>
              </Table>
                :

                <>
                <EmptyContent 
                    title="Leaderboard is currently empty!"
                    description={`Check back later :)`}
                    sx={{
                      '& span.MuiBox-root': { height: 160 },
                    }}/>
                </>
            }
            </TableContainer>
          </Scrollbar>
        </Card>

    </>
  )
}

export default LeaderboardList