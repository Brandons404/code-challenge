import React from 'react';
import { Dialog, DialogActions, DialogTitle, DialogContent, Typography, Button, CircularProgress } from '@mui/material';
import { format, addMinutes, set } from 'date-fns';
import { useSchedule } from '../../hooks';
import { v4 as uuid } from 'uuid';

const cleanDate = (date: Date | number) => {
  return set(date, {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
};

const TimeSlotConfirm = ({
  open,
  startTime,
  loading,
  setLoading,
  update,
  onClose,
}: {
  open: boolean;
  loading: boolean;
  startTime: Date;
  onClose: () => void;
  update: () => Promise<void>;
  setLoading: (x: boolean) => void;
}) => {
  const { currentProviderId, addBooking } = useSchedule();

  const handleConfirm = async () => {
    setLoading(true);
    await addBooking(currentProviderId, cleanDate(new Date(startTime)).toString(), { id: uuid(), startTime: startTime.toString() });
    update();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        {`Confirm appointment for ${format(new Date(startTime), 'MM/dd/yyyy')} from ${format(new Date(startTime), 'h:mm b')} to ${format(
          addMinutes(new Date(startTime), 15),
          'h:mm b'
        )}?`}
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleCancel}>
          cancel
        </Button>
        <Button disabled={loading} variant='contained' onClick={handleConfirm}>
          confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimeSlotConfirm;
