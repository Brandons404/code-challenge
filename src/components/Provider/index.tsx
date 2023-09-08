import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { set, getDate, getYear, format } from 'date-fns';
import { useSchedule } from '../../hooks';

const cleanDate = (date: Date | number) => {
  return set(date, {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
};

const Provider = () => {
  const { currentProviderId, setUserType, getProviderAvailability, setProviderAvailability } = useSchedule();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [availability, setAvailability] = useState(null);

  const enableAddButton = selectedDate && fromTime && toTime;

  const getAvailability = async () => {
    setLoading(true);
    const tempAvailability = await getProviderAvailability(currentProviderId, selectedDate);
    setLoading(false);
    setAvailability(tempAvailability);
  };

  useEffect(() => {
    if (selectedDate) {
      getAvailability();
    }
  }, [selectedDate]);

  const handleDateChange = (value: Date) => {
    setSelectedDate(value);
  };

  const handleFromChange = (value: Date) => {
    setFromTime(value);
  };

  const handleToChange = (value: Date) => {
    setToTime(value);
  };

  const handleAddClick = async () => {
    const selectedDateStr = cleanDate(selectedDate).toString();
    const setCorrectDay = (time: Date) => {
      return set(time, {
        year: getYear(selectedDate),
        date: getDate(selectedDate),
      });
    };
    const fromTimeStr = setCorrectDay(fromTime).toString();
    const toTimeStr = setCorrectDay(toTime).toString();
    setLoading(true);
    await setProviderAvailability(currentProviderId, selectedDateStr, { startTime: fromTimeStr, endTime: toTimeStr });
    getAvailability();
    setLoading(false);

    setFromTime(null);
    setToTime(null);
  };

  return (
    <>
      <Box sx={{ minHeight: 'calc(100vh - 34px)', width: 'calc(100vw - 34px)', p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
          <Button variant='contained' onClick={() => setUserType('')}>
            Back
          </Button>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <DatePicker onChange={handleDateChange} value={selectedDate} sx={{ width: '100%' }} />
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <TimePicker label='from' value={fromTime} onChange={handleFromChange} minutesStep={15} />
            <TimePicker label='to' value={toTime} onChange={handleToChange} minutesStep={15} />
          </Box>
        </Box>
        {availability && availability.startTime ? <Box>{`${format(new Date(availability.startTime), 'h:mm b')} - ${format(new Date(availability.endTime), 'h:mm b')}`}</Box> : null}
        <Button variant='outlined' onClick={handleAddClick} disabled={!enableAddButton}>
          {loading ? <CircularProgress size={30} /> : 'add time to schedule'}
        </Button>
      </Box>
    </>
  );
};

export default Provider;
