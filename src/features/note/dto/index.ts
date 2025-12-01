import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateNoteDTO {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  content: string;

  @IsBoolean()
  isPrivate: boolean;
}

export class UpdateNoteDTO {
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsBoolean()
  isPrivate: boolean;
}

export class GetNoteDTO{
  title: string;
  content: string;
  userId: number;
}