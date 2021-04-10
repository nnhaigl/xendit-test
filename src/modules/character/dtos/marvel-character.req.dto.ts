import { MarvelReqDto } from "./marvel.req.dto"

export class MarvelCharacterReqDto extends MarvelReqDto {
  limit: number
  offset: number
}