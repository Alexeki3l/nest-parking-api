import { faker } from '@faker-js/faker';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserRole } from 'src/users/entities/user.entity';

export function fakeUser(role: string): CreateUserDto {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    name: faker.person.fullName(),
    phone: faker.phone.number(),
    role: UserRole[role as keyof typeof UserRole] || UserRole.CLIENTE,
  };
}
