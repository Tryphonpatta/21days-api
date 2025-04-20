import { PartialType } from '@nestjs/mapped-types';
import { CreateCompleteDto } from './create-complete.dto';

export class UpdateCompleteDto extends PartialType(CreateCompleteDto) {}
