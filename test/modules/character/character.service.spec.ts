import "reflect-metadata"
import { CharacterService } from '../../../src/modules/character/character.service';
import { LoggerService, RequestService } from '../../../src/services';
import { InternalServerError, NoContentError } from "../../../src/errors";
import { HTTP_STATUS } from "../../../common";
import { ErrorDto } from "../../../src/dtos";

describe('character service', () => {
  let service: CharacterService
  beforeEach(async () => {
    const requestService = new RequestService();
    const logger = new LoggerService()
    service = new CharacterService(requestService, logger)
  })
  describe('getNumberOfCharacter', () => {
    it('it should success when return total of character', async () => {
      jest.spyOn(RequestService.prototype, 'get').mockResolvedValue({
        statusCode: HTTP_STATUS.OK,
        body: {
          "code": 200,
          "status": "Ok",
          "copyright": "© 2021 MARVEL",
          "attributionText": "Data provided by Marvel. © 2021 MARVEL",
          "attributionHTML": "<a href=\"http://marvel.com\">Data provided by Marvel. © 2021 MARVEL</a>",
          "etag": "2109e1c5e5f7c8b8d8547c0b09c034d65c2a8aef",
          "data": {
            "offset": 14,
            "limit": 100,
            "total": 1493,
            "count": 100
          }
        },

      })
      const response = await service.getNumberOfCharacter();
      expect(response).toEqual(1493)
    })
    it('it should throw internal error when call api fail', async () => {
      jest.spyOn(RequestService.prototype, 'get').mockResolvedValue({
        statusCode: HTTP_STATUS.PARTIAL_CONTENT,
        body: null
      })
      let error = null
      try {
        const response = await service.getNumberOfCharacter();
      }
      catch (err) {
        error = err
      }
      expect(error).toStrictEqual(new InternalServerError(new ErrorDto("InternalError", "Internal Error")))
    })
  })

  describe('getCharacter', () => {
    it('it should success when character exist', async () => {
      jest.spyOn(RequestService.prototype, 'get').mockResolvedValue({
        statusCode: HTTP_STATUS.OK,
        body: {
          "code": 200,
          "status": "Ok",
          "copyright": "© 2021 MARVEL",
          "attributionText": "Data provided by Marvel. © 2021 MARVEL",
          "attributionHTML": "<a href=\"http://marvel.com\">Data provided by Marvel. © 2021 MARVEL</a>",
          "etag": "2109e1c5e5f7c8b8d8547c0b09c034d65c2a8aef",
          "data": {
            "offset": 0,
            "limit": 1,
            "total": 149,
            "count": 1,
            "results": [
              {
                "id": 1009150,
                "name": "Agent Zero",
                "description": "",
              }
            ]
          }
        },

      })
      const response = await service.getCharacter(1009150);
      expect(response).toEqual({
        "id": 1009150,
        "name": "Agent Zero",
        "description": "",
      })
    })
    it('it should throw NO_CONTENT when character not exists', async () => {
      jest.spyOn(RequestService.prototype, 'get').mockResolvedValue({
        statusCode: HTTP_STATUS.NOT_FOUND,
        body: {
          "code": 404,
          "status": "We couldn't find that character"
        }

      })
      let error = null
      try {
        const response = await service.getCharacter(1000);
      }
      catch (err) {
        error = err
      }
      expect(error).toStrictEqual(new NoContentError())
    })
    it('it should throw internal error when call api fail', async () => {
      jest.spyOn(RequestService.prototype, 'get').mockResolvedValue({
        statusCode: HTTP_STATUS.PARTIAL_CONTENT,
        body: null
      })
      let error = null
      try {
        const response = await service.getCharacter(1000);
      }
      catch (err) {
        error = err
      }
      expect(error).toStrictEqual(new InternalServerError(new ErrorDto("InternalError", "Internal Error")))
    })
  })
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }
  describe('getCharacters', () => {
    it('it should success when return all characters', async () => {
      const data = []
      const results = []
      for (let i = 0; i < 149; i++) {
        const id = getRandomIntInclusive(100000, 999999)
        results.push(id)
        data.push({
          "id": id,
          "name": "Agent Zero",
          "description": "",
        })
      }
      jest.spyOn(RequestService.prototype, 'get')
        .mockResolvedValueOnce({
          statusCode: HTTP_STATUS.OK,
          body: {
            "code": 200,
            "status": "Ok",
            "copyright": "© 2021 MARVEL",
            "attributionText": "Data provided by Marvel. © 2021 MARVEL",
            "attributionHTML": "<a href=\"http://marvel.com\">Data provided by Marvel. © 2021 MARVEL</a>",
            "etag": "2109e1c5e5f7c8b8d8547c0b09c034d65c2a8aef",
            "data": {
              "offset": 0,
              "limit": 1,
              "total": 149,
              "count": 1,
              "results": []
            }
          },

        })
        .mockResolvedValueOnce({
          statusCode: HTTP_STATUS.OK,
          body: {
            "code": 200,
            "status": "Ok",
            "copyright": "© 2021 MARVEL",
            "attributionText": "Data provided by Marvel. © 2021 MARVEL",
            "attributionHTML": "<a href=\"http://marvel.com\">Data provided by Marvel. © 2021 MARVEL</a>",
            "etag": "2109e1c5e5f7c8b8d8547c0b09c034d65c2a8aef",
            "data": {
              "offset": 0,
              "limit": 100,
              "total": 149,
              "count": 100,
              "results": data.slice(0, 100)
            }
          },

        }).mockResolvedValueOnce({
          statusCode: HTTP_STATUS.OK,
          body: {
            "code": 200,
            "status": "Ok",
            "copyright": "© 2021 MARVEL",
            "attributionText": "Data provided by Marvel. © 2021 MARVEL",
            "attributionHTML": "<a href=\"http://marvel.com\">Data provided by Marvel. © 2021 MARVEL</a>",
            "etag": "2109e1c5e5f7c8b8d8547c0b09c034d65c2a8aef",
            "data": {
              "offset": 100,
              "limit": 100,
              "total": 149,
              "count": 49,
              "results": data.slice(0, 49)
            }
          },

        })
      const response = await service.getCharacters();
      expect(response.length).toEqual(149)
    })

    it('it should throw internal error when call api fail', async () => {
      jest.spyOn(RequestService.prototype, 'get').mockResolvedValue({
        statusCode: HTTP_STATUS.PARTIAL_CONTENT,
        body: null
      })
      let error = null
      try {
        const response = await service.getCharacters();
      }
      catch (err) {
        error = err
      }
      expect(error).toStrictEqual(new InternalServerError(new ErrorDto("InternalError", "Internal Error")))
    })

  })

})