import { faker } from '@faker-js/faker';

export function fakeParking() {
  return {
    name: faker.company.name(),
    totalSlots: faker.number.int({ min: 1, max: 10 }),
  };
}
