import React, { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, addMinutes } from 'date-fns';
import { useSchedule } from '../../hooks';
import TimeSlot from './TimeSlot';
import TimeSlotConfirm from './TimeSlotConfirm';

const Client = () => {
  const { currentProviderId, setUserType, getProviderAvailability, getProviderBooks } = useSchedule();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availability, setAvailability] = useState<{ startTime: string; endTime: string } | null>(null);
  const [books, setBooks] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

  const currentBookings = useMemo(() => {
    return books.map((book) => book.startTime);
  }, [selectedDate, books]);

  const allSlots = useMemo(() => {
    if (availability?.startTime) {
      let tempTimeSlots: Date[] = [];

      let current = new Date(availability.startTime).getTime();
      const endTime = new Date(availability.endTime).getTime();
      while (current < endTime) {
        // This should really be done on the backend
        if (!currentBookings.includes(new Date(current).toString())) {
          tempTimeSlots = [...tempTimeSlots, new Date(current)];
        }
        current = addMinutes(current, 15).getTime();
      }
      return tempTimeSlots;
    }
    return [];
  }, [availability, currentBookings]);

  const getAvailability = async () => {
    try {
      setLoading(true);
      const tempAvailability = await getProviderAvailability(currentProviderId, selectedDate);
      if (tempAvailability || tempAvailability === null) {
        setAvailability(tempAvailability);
      }
    } catch (e) {
      throw new Error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getBooks = async () => {
    try {
      setLoading(true);
      const tempBooks = await getProviderBooks(currentProviderId, selectedDate);
      if (tempBooks) {
        setBooks(tempBooks);
        setLoading(false);
      }
    } catch (e) {
      throw new Error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const update = async () => {
    await getBooks();
    await getAvailability();
  };

  useEffect(() => {
    if (selectedDate) {
      update();
    }
  }, [selectedDate]);

  const handleDateChange = (value: Date) => {
    setSelectedDate(value);
  };

  return (
    <>
      <Box sx={{ width: 'calc(100% - 8px)', position: 'absolute', top: '8px', left: '8px', display: 'flex', justifyContent: 'flex-start' }}>
        <Button variant='contained' onClick={() => setUserType('')}>
          Back
        </Button>
      </Box>
      <TimeSlotConfirm open={!!selectedSlot} loading={loading} update={update} onClose={() => setSelectedSlot(null)} startTime={selectedSlot} setLoading={setLoading} />
      <Typography variant='h5' component='p'>
        {selectedDate ? 'Please choose a time slot you would like to reserve.' : 'Please select a date to check availability'}
      </Typography>
      <Box sx={{ height: '100%', width: 'calc(100vw - 34px)', p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <DatePicker onChange={handleDateChange} value={selectedDate} sx={{ width: '100%' }} />
        </Box>
        {loading ? <CircularProgress sx={{ mx: 'auto' }} /> : null}
        {selectedDate && !loading && (!availability?.startTime || !allSlots.length) ? <Typography>There are no available time slots for the selected date</Typography> : null}
        {allSlots.length ? allSlots.map((slot) => <TimeSlot key={`book-${format(slot, 'h:mm b')}`} setSelectedSlot={(time: Date) => setSelectedSlot(time)} time={slot} />) : null}
      </Box>
    </>
  );
};

export default Client;
