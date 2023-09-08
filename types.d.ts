declare type TimeSlot = {
  clientId?: string;
  startTime: string;
};

declare type Provider = {
  id: string;
  schedule: {
    available: {
      [key: string]: { startTime: string; endTime: string };
    };
    booked: {
      [key: string]: TimeSlot[];
    };
  };
};

declare type Client = {
  id: string;
};
