import axios, { AxiosError, AxiosResponse } from 'axios';
import { ILoggerService } from '../interfaces';
import { ReqOptions, ResponseDto } from '../dtos';
import { LoggerService } from './logger-service';
import { HTTP_STATUS } from '../../common';

export class RequestService {
  private logger: ILoggerService = new LoggerService()
  private transform(response: AxiosError | AxiosResponse): ResponseDto {
    const result = new ResponseDto();
    result.body = "data" in response ? response.data : null;
    result.statusCode = "status" in response ? response.status : response.response.status;
    return result;
  }
  public async get(url: string, options?: ReqOptions): Promise<ResponseDto> {
    return new Promise((resolve, reject) => {
      axios.get(url, options).then((response: AxiosResponse) => {
        resolve(this.transform(response))
      }).catch((reason: AxiosError) => {
        resolve(this.transform(reason))
      })
    })
  }
}