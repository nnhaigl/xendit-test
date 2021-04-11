import "reflect-metadata"
import { CharacterService } from '../../../src/modules/character/character.service';
import { LoggerService, RequestService } from '../../../src/services';
import { CharacterController } from '../../../src/modules/character/character.controller';
import { NoContentError } from "../../../src/errors";
import cacheLocal from '../../../src/utils/cach-local'
describe('character controller', () => {
  let controller: CharacterController
  beforeEach(async () => {
    const requestService = new RequestService();
    const logger = new LoggerService()
    const characterService = new CharacterService(requestService, logger)
    controller = new CharacterController(requestService, characterService, logger);
  })
  afterAll(()=>{
    jest.resetAllMocks()
  })
  describe('getCharacter', () => {
    it('should return character info when exists', async () => {
      jest.spyOn(CharacterService.prototype, 'getCharacter').mockResolvedValue({
        id: 1000,
        name: "abc",
        description: "abc"
      })
      const response = await controller.getCharacter(1000);
      expect(response).toEqual({
        id: 1000,
        name: "abc",
        description: "abc"
      })
    })
    it('should throw error with status code 204 ', async () => {
      jest.spyOn(CharacterService.prototype, 'getCharacter').mockImplementation(() => {
        throw new NoContentError()
      })
      let error = null;
      try {
        const response = await controller.getCharacter(1000);
      } catch (err) {
        error = err
      }
      expect(error).toStrictEqual(new NoContentError())
    })
  })
  describe('getCharacters', () => {
    it('should return list character when first call', async () => {
      jest.spyOn(CharacterService.prototype, 'getNumberOfCharacter').mockResolvedValue(3);
      jest.spyOn(CharacterService.prototype, 'getCharacters').mockResolvedValue([1, 2, 3]);
      const response = await controller.getCharacters();
      expect(response).toEqual([1, 2, 3])
    })
    it('should return list character from cache from second call', async () => {
      jest.spyOn(CharacterService.prototype, 'getNumberOfCharacter').mockResolvedValue(3);
      jest.spyOn(CharacterService.prototype, 'getCharacters').mockResolvedValue([1, 2, 3]);
      const response = await controller.getCharacters();
      cacheLocal.set('characters', [4, 5, 6]);
      const response2 = await controller.getCharacters();
      expect(response).toEqual([1, 2, 3])
      expect(response2).toEqual([4, 5, 6])
    })
  })
})