import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Provider from './components/Provider';
import Client from './components/Client';
import { useSchedule } from './hooks';
import './App.css';

function App() {
  const { userType, setUserType } = useSchedule();

  return (
    <>
      {userType === '' ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            rowGap: 3,
            columnGap: 3,
          }}
        >
          <Typography variant='h4' component='h1' sx={{ width: '100%' }}>
            Sign in...
          </Typography>
          <Button variant='contained' onClick={() => setUserType('provider')}>
            Provider
          </Button>
          <Button variant='contained' onClick={() => setUserType('client')}>
            Client
          </Button>
        </Box>
      ) : (
        {
          provider: <Provider />,
          client: <Client />,
        }[userType]
      )}
    </>
  );
}

export default App;

