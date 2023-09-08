import React, { useState, createContext } from 'react';

import api from '../api';

type ScheduleProviderContextType = {
  userType: 'provider' | 'client' | '';
  setUserType: (arg: 'provider' | 'client' | '') => void;
  currentProviderId: string;
  getProviderAvailability: (providerId: string, day: string) => Promise<{ startTime: string; endTime: string } | null>;
  getProviderBooks: (providerId: string, day: string) => Promise<{ id: string; startTime: string; endTime: string }[] | null | void>;
  addBooking: (providerId: string, day: string, booking: { id: string; startTime: string }) => Promise<{ startTime: string; endTime: string } | null | void>;
  setProviderAvailability: (providerId: string, day: string, availability: { startTime: string; endTime: string }) => Promise<void>;
};

export const ScheduleProviderContext = createContext<ScheduleProviderContextType | null>(null);

interface ScheduleProviderProps {
  children: React.ReactNode;
}

const ScheduleProvider = ({ children }: ScheduleProviderProps) => {
  const [userType, setUserType] = useState<'provider' | 'client' | ''>('');
  const [currentProviderId] = useState('a95ac94d-53e7-478e-92d1-4242188f9c97');

  const getProviderAvailability = async (providerId: string, day: string) => {
    try {
      return api.getProviderAvailability(providerId, day);
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const getProviderBooks = async (providerId: string, day: string) => {
    try {
      return api.getProviderBooks(providerId, day);
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const setProviderAvailability = async (providerId: string, day: string, availability: { startTime: string; endTime: string }) => {
    try {
      await api.setProviderAvailability(providerId, day, availability);
      return;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const addBooking = async (providerId: string, day: string, booking: { id: string; startTime: string }) => {
    api.addBooking(providerId, day, booking);
    try {
      await api.addBooking(providerId, day, booking);
      return;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return (
    <ScheduleProviderContext.Provider value={{ userType, setUserType, currentProviderId, getProviderBooks, getProviderAvailability, addBooking, setProviderAvailability }}>
      {children}
    </ScheduleProviderContext.Provider>
  );
};

export default ScheduleProvider;
