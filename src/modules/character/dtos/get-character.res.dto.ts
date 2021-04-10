import { Type } from "class-transformer"
import { GetCharacterDataResDto } from "./get-character-data.res.dto"

export class GetCharacterResDto {
  code: number
  status: string
  @Type(()=>GetCharacterDataResDto)
  data: GetCharacterDataResDto
}
