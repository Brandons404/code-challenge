import { useContext } from 'react';
import { ScheduleProviderContext } from './ScheduleProvider';

export const useSchedule = () => useContext(ScheduleProviderContext);
