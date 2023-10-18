import * as AWS from 'aws-sdk';

import pino from 'pino';

export interface CloudWatchDestinationOptions {
  logGroupName: string;
  logStreamName: string;
}

export interface CloudWatchOptions {
  serviceOptions: AWS.ConfigurationOptions;
  destinationOptions: CloudWatchDestinationOptions;
}

export interface CloudWatchLoggerOptions extends pino.LoggerOptions {
  cloudWatchOptions: CloudWatchOptions;
}

class CloudWatchStream implements pino.DestinationStream {
  private cloudWatchService: AWS.CloudWatchLogs;
  private nextSequenceToken: string;
  private logGroupName: string;
  private logStreamName: string;

  constructor(cloudWatchOptions: CloudWatchOptions) {
    this.cloudWatchService = new AWS.CloudWatchLogs(cloudWatchOptions.serviceOptions);
    this.logGroupName = cloudWatchOptions.destinationOptions.logGroupName;
    this.logStreamName = cloudWatchOptions.destinationOptions.logStreamName;
  }

  async putLogEvent(params: AWS.CloudWatchLogs.Types.PutLogEventsRequest): Promise<void> {
    try {
      const data = await this.cloudWatchService.putLogEvents(params).promise();
      if (data.nextSequenceToken) {
        this.nextSequenceToken = data.nextSequenceToken;
      }
    } catch (error) {
      if (error.code === 'InvalidSequenceTokenException') {
        this.nextSequenceToken = error.message.split(':')[1].trim();
        params.sequenceToken = this.nextSequenceToken;
        this.putLogEvent(params);
      }
    }
  }

  write(message: string): void {
    const params = {
      logEvents: [
        {
          message,
          timestamp: new Date().getTime(),
        },
      ],
      logGroupName: this.logGroupName,
      logStreamName: this.logStreamName,
      sequenceToken: this.nextSequenceToken,
    };

    this.putLogEvent(params);
  }
}

export class CloudWatchLogger {
  private cloudWatchStream: pino.DestinationStream;

  logger: pino.Logger;

  constructor(options: CloudWatchLoggerOptions) {
    this.cloudWatchStream = new CloudWatchStream(options.cloudWatchOptions);

    this.logger = pino(
      {
        level: options.level || 'error',
        prettyPrint: false,
      },
      this.cloudWatchStream,
    );
  }
}
