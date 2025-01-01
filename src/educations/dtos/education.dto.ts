import { Expose } from 'class-transformer';

export class EducationDto {
  @Expose()
  id: string;

  @Expose()
  institution: string;

  @Expose()
  degree: string;

  @Expose()
  course: string;

  @Expose()
  start_date: Date;

  @Expose()
  end_date: Date;
}
