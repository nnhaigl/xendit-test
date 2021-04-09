import * as bodyParser from 'body-parser'
import { Request, Response } from 'express'
import { BadRequestException } from '../exception/bad-excception'
import { BODY_PARSER_JSON_ERROR } from '../../common'
export function bodyParserMiddleware(
  req: Request,
  res: Response,
  next: (...args) => void,
) {
  bodyParser.json()(req, res, (err) => {
    let errorException = null
    if (err) errorException = new BadRequestException(BODY_PARSER_JSON_ERROR)
    next(errorException)
  })
}
