import pino from 'pino';

export interface ConsoleLoggerOptions extends pino.LoggerOptions {
  prettyPrintOptions?: Record<string, any>;
}

export class ConsoleLogger {
  logger: pino.Logger;

  constructor(options?: ConsoleLoggerOptions) {
    this.logger = pino({
      level: options?.level || 'info',
      formatters: {
        level: (label: string) => ({ level: label }),
      },
      transport: {
        target: 'pino-pretty',
        options: options?.prettyPrintOptions || {
          colorize: true,
          translateTime: true,
          levelFirst: true,
          ignore: 'pid,hostname',
        },
      },
    });
  }
}
