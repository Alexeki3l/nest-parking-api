import { faker } from '@faker-js/faker/.';

export function fakeVehicle() {
  return {
    licensePlate: faker.vehicle.vrm(),
    brand: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
  };
}
