import { ErrorDto, ResponseDto } from "../../dtos";
import { HTTP_STATUS, MARVEL_URL, PUBLIC_KEY, PRIVATE_KEY } from "../../../common";
import { LoggerService, RequestService } from "../../services";
import { InternalServerError, NoContentError } from "../../errors";
import { serialize, TransformHelper } from "../../utils";
import { GetCharacterResDto } from "./dtos/get-character.res.dto";
import md5 from 'md5'
import { MarvelReqDto } from "./dtos/marvel.req.dto";
import { CharacterResDto } from "./dtos/character.res.dto";

export class CharacterService {
  constructor(private requestService: RequestService, private logger: LoggerService) {
    this.requestService = new RequestService();
    this.logger = new LoggerService()
  }
  private generateParams(data: object): MarvelReqDto {
    const resuslt = new MarvelReqDto()
    resuslt.ts = new Date().getTime();
    resuslt.hash = md5(resuslt.ts + PRIVATE_KEY + PUBLIC_KEY).toString();
    resuslt.apikey = PUBLIC_KEY
    return { ...resuslt, ...data };
  }
  public async getNumberOfCharacter(): Promise<number> {
    const params = this.generateParams({
      limit: 1
    })

    const response: ResponseDto = await this.requestService.get(`${MARVEL_URL}/v1/public/characters?${serialize(params)}`)
    if (response.statusCode !== HTTP_STATUS.OK) {
      throw new InternalServerError(new ErrorDto("InternalError", "Internal Error"))
    }
    const { data } = TransformHelper.transform(response.body, GetCharacterResDto)
    return data.total
  }
  public async getCharacters(): Promise<Array<number>> {
    const total = await this.getNumberOfCharacter();
    const result = new Array<number>();
    await Promise.all(Array.from(Array(Math.ceil(total / 100)), (_, index) => index + 1).map(async (item) => {
      const response: ResponseDto = await this.requestService.get(`${MARVEL_URL}/v1/public/characters?${serialize(this.generateParams({
        limit: 100,
        offset: (item - 1) * 100
      }))}`)
      if (response.statusCode !== HTTP_STATUS.OK) {
        throw new InternalServerError(new ErrorDto("InternalError", "Internal Error"))
      }
      const objectData: GetCharacterResDto = TransformHelper.transform(response.body, GetCharacterResDto)
      result.push(...objectData.data.results.map(item => item.id))
    }))
    return result
  }

  public async getCharacter(id: number): Promise<CharacterResDto> {
    const response: ResponseDto = await this.requestService.get(`${MARVEL_URL}/v1/public/characters/${id}?${serialize(this.generateParams({
      limit: 1
    }))}`)
    if (response.statusCode === HTTP_STATUS.NOT_FOUND) {
      throw new NoContentError()
    }
    if (response.statusCode !== HTTP_STATUS.OK) {
      throw new InternalServerError(new ErrorDto("InternalError", "Internal Error"))
    }
    const objectData: GetCharacterResDto = TransformHelper.transform(response.body, GetCharacterResDto)
    return {
      id: objectData.data.results[0].id,
      name: objectData.data.results[0].name,
      description: objectData.data.results[0].description
    }
  }
}