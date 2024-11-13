import { SetMetadata } from '@nestjs/common';
import { ClassInterface } from '../interfaces/class.interface';

export const SerializeMeta = 'Serialize';
export const Serialize = (dto: ClassInterface) =>
  SetMetadata(SerializeMeta, dto);
