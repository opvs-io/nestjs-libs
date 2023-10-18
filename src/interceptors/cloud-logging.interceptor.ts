/* eslint-disable no-empty */

import * as changeCase from 'change-case';
import * as validator from 'class-validator';

import pino from 'pino';

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const httpIntercept = (context: ExecutionContext, next: CallHandler, logger: pino.Logger): Observable<any> => {
  const sendLog = (type: 'info' | 'error'): void => {
    switch (type) {
      case 'info': {
        logger.info(request.logData);
        break;
      }
      case 'error': {
        logger.error(request.logData);
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleNextEvent = (responseBody: any): void => {
    request.logData.res = {
      status: response.statusCode,
      body: validator.isDefined(responseBody) ? responseBody : undefined,
    };

    sendLog('info');
  };

  const handleErrorEvent = (error: any): void => {
    request.logData.res = {
      status: error.status || 500,
      error: validator.isNotEmptyObject(error)
        ? {
            name: validator.isDefined(error.name) ? error.name : undefined,
            message: validator.isDefined(error.message) ? error.message : undefined,
            stack: validator.isDefined(error.stack) ? error.stack : undefined,
          }
        : error,
    };

    sendLog('error');
  };

  const http: any = context.switchToHttp();
  const request = http.getRequest();
  const response = http.getResponse();

  request.logData = {};

  request.logData.eventType = 'http';

  request.logData.req = {
    method: request.method,
    url: request.url,
    headers: request.headers,
    user: validator.isDefined(request.user) ? request.user : undefined,
    params: validator.isDefined(request.params) && Object.keys(request.params).length > 0 ? request.params : undefined,
    query: validator.isDefined(request.query) && Object.keys(request.query).length > 0 ? request.query : undefined,
    body: validator.isDefined(request.body) ? request.body : undefined,
  };

  try {
    request.logData.subject = `${changeCase.paramCase(http.constructorRef.name)}:${changeCase.paramCase(
      http.handler.name,
    )}`;
  } catch (error) {}

  return next.handle().pipe(
    tap({
      next: handleNextEvent,
      error: handleErrorEvent,
    }),
  );
};

const rpcIntercept = (context: ExecutionContext, next: CallHandler, logger: pino.Logger): Observable<any> => {
  const sendLog = (type: 'info' | 'error'): void => {
    switch (type) {
      case 'info': {
        logger.info(rpcContext.logData);
        break;
      }
      case 'error': {
        logger.error(rpcContext.logData);
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleNextEvent = (responseBody: any): void => {
    rpcContext.logData.res = {
      body: validator.isDefined(responseBody) ? responseBody : undefined,
    };

    sendLog('info');
  };

  const handleErrorEvent = (error: any): void => {
    rpcContext.logData.res = {
      status: error.status || 500,
      error: validator.isNotEmptyObject(error)
        ? {
            name: validator.isDefined(error.name) ? error.name : undefined,
            message: validator.isDefined(error.message) ? error.message : undefined,
            stack: validator.isDefined(error.stack) ? error.stack : undefined,
          }
        : error,
    };

    sendLog('error');
  };

  const rpc = context.switchToRpc();
  const rpcContext = rpc.getContext();

  rpcContext.logData = {};

  rpcContext.logData.eventType = 'rpc';

  rpcContext.logData.req = {
    body: rpc.getData(),
  };

  try {
    const subscription = rpcContext.message.subscription;
    rpcContext.logData.queueGroup = subscription.qGroup;
    rpcContext.logData.subject = subscription.subject;
  } catch (error) {}

  return next.handle().pipe(
    tap({
      next: handleNextEvent,
      error: handleErrorEvent,
    }),
  );
};

@Injectable()
export class CloudLoggingInterceptor implements NestInterceptor {
  private logger: pino.Logger;

  constructor(logger: pino.Logger) {
    this.logger = logger;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextType = context.getType();

    switch (contextType) {
      case 'http': {
        return httpIntercept(context, next, this.logger);
      }
      case 'rpc': {
        return rpcIntercept(context, next, this.logger);
      }
      default:
        return;
    }
  }
}
