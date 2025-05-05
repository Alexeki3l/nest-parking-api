import { faker } from '@faker-js/faker';
import { fakeVehicle } from './vehicle-fake';

export function fakeReservation(numberSlots: number) {
  return Object.assign(fakeVehicle(), {
    slotNumber: faker.number.int({ min: 1, max: numberSlots }),
    startDateTime: '2025-05-07 23:11:49-04',
    endDateTime: '2025-05-08 23:11:49-04',
  });
}
