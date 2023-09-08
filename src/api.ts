import { v4 as uuid } from 'uuid';

// for mocking load time
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const init = async () => {
  const data = await load('providers');
  if (data === null) {
    const defaultProviders = {
      'a95ac94d-53e7-478e-92d1-4242188f9c97': {
        id: 'a95ac94d-53e7-478e-92d1-4242188f9c97',
        schedule: {
          available: {},
          booked: {},
        },
      },
    };
    save('providers', defaultProviders);
  }
};

const save = async (name: string, data: Record<string, unknown> | unknown[]) => {
  try {
    const stringifiedData = JSON.stringify(data);
    localStorage.setItem(name, stringifiedData);
    return;
  } catch {
    console.error(`There was an error saving ${name}`);
  }
};

const load = async (name: string) => {
  try {
    const tempData = localStorage.getItem(name);
    if (tempData === null) return null;
    return JSON.parse(tempData);
  } catch {
    console.error(`There was an error loading ${name}`);
    return null;
  }
};

const api = {
  getProviderAvailability: async (providerId: string, day: string): Promise<{ startTime: string; endTime: string } | null> => {
    const allProvidersOld = await load('providers');

    await sleep(1500);

    if (allProvidersOld[providerId]) {
      const oldProvider = allProvidersOld[providerId];
      return oldProvider.schedule.available[day] ?? null;
    }

    return null;
  },

  getProviderBooks: async (providerId: string, day: string) => {
    const allProvidersOld = await load('providers');

    await sleep(1500);

    if (allProvidersOld[providerId]) {
      const oldProvider = allProvidersOld[providerId];
      return oldProvider.schedule.booked[day] ?? null;
    }
  },

  addBooking: async (providerId: string, day: string, booking: { id: string; startTime: string }): Promise<{ startTime: string; endTime: string } | null> => {
    const allProvidersOld = await load('providers');

    await sleep(1500);

    if (allProvidersOld[providerId]) {
      const oldProvider = allProvidersOld[providerId];
      const newProvider: Provider = {
        ...oldProvider,
        schedule: { ...oldProvider.schedule, booked: { ...oldProvider.schedule.booked, [day]: [...(oldProvider.schedule.booked?.[day] || []), booking] } },
      };
      const newAllProviders = { ...allProvidersOld, [providerId]: newProvider };
      await save('providers', newAllProviders);
      return;
    }

    const newProvider: Provider = { id: uuid(), schedule: { booked: { [day]: [booking] }, available: {} } };
    const newAllProviders = { ...allProvidersOld, [providerId]: newProvider };
    await save('providers', newAllProviders);
    return;
  },

  /**
   * for now, updating availability for the same day will overwrite it. This could be an array in the future
   */
  setProviderAvailability: async (providerId: string, day: string, availability: { startTime: string; endTime: string }) => {
    const allProvidersOld = await load('providers');

    await sleep(1500);

    if (allProvidersOld[providerId]) {
      const oldProvider = allProvidersOld[providerId];
      const newProvider: Provider = { ...oldProvider, schedule: { ...oldProvider.schedule, available: { ...oldProvider.schedule.available, [day]: availability } } };
      const newAllProviders = { ...allProvidersOld, [providerId]: newProvider };
      await save('providers', newAllProviders);
      return;
    }

    const newProvider: Provider = { id: uuid(), schedule: { booked: {}, available: { [day]: availability } } };
    const newAllProviders = { ...allProvidersOld, [providerId]: newProvider };
    await save('providers', newAllProviders);
    return;
  },
};

init();

export default api;
