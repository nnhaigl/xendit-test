import { Type } from "class-transformer"
import { GetCharacterResultResDto } from "./get-character-result.res.dto"

export class GetCharacterDataResDto {
  offset: number
  limit: number
  total: number
  @Type(() => GetCharacterResultResDto)
  results: GetCharacterResultResDto[]
}
