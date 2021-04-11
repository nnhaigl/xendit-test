import { LoggerService, RequestService } from '../../services';
import { Get, Param } from '../../decorators';
import { CharacterResDto } from './dtos/character.res.dto';
import { CharacterService } from './character.service';
import cacheLocal from '../../utils/cach-local'

const key = "characters";

export class CharacterController {
  constructor(private requestService: RequestService, private service: CharacterService, private logger: LoggerService) {
    this.requestService = new RequestService();
    this.logger = new LoggerService();
    this.service = new CharacterService(requestService, logger);
  }

  @Get('/api/v1/characters')
  async getCharacters(): Promise<Array<Number>> {
    const total = await this.service.getNumberOfCharacter();
    if (cacheLocal.get(key) && (cacheLocal.get(key) as Array<number>).length === total) {
      return (cacheLocal.get(key) as Array<number>);
    }
    const result =  await this.service.getCharacters()
    cacheLocal.set(key,result);
    return result;
  }

  @Get('/api/v1/characters/:characterId')
  async getCharacter(@Param("characterId") characterId: number): Promise<CharacterResDto> {
    return this.service.getCharacter(characterId)
  }
}