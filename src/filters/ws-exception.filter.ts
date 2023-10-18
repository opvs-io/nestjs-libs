import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const response = ctx.getClient();
    const status = exception.status || 500;

    response.emit('exception', {
      name: exception.name || 'UNKNOWN_ERROR_NAME',
      status,
      message: exception.message,
    });
  }
}
