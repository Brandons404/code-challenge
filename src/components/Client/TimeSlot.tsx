import React from 'react';
import Box from '@mui/material/Box';
import { format } from 'date-fns';

const TimeSlot = ({ setSelectedSlot, time }: { time: Date; setSelectedSlot: (time: Date) => void }) => {
  const handleClick = async () => {
    setSelectedSlot(time);
  };

  return (
    <Box onClick={handleClick} sx={{ border: '1px solid white', width: '95%', my: 1, mx: 'auto' }}>
      {format(time, 'h:mm b')}
    </Box>
  );
};

export default TimeSlot;
