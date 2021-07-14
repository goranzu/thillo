import { CreateDto } from "./create.dto";

export interface UpdateDto extends Partial<CreateDto> {
  passwordSalt: Buffer;
}
