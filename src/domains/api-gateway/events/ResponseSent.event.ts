/**
 * ResponseSent Event
 *
 * Event emitted when an API response is sent.
 */

import type { ResponseId } from '../value-objects/ResponseId';
import type { RequestId } from '../value-objects/RequestId';
import type { StatusCode } from '../entities/ApiResponse';

/**
 * ResponseSent event class.
 * Emitted when an API response is sent.
 */
export class ResponseSent {
  public readonly eventType = 'ResponseSent';
  public readonly responseId: string;
  public readonly requestId: string;
  public readonly statusCode: StatusCode;
  public readonly responseTime: number;
  public readonly timestamp: Date;

  /**
   * Creates a new ResponseSent event.
   */
  constructor(params: {
    responseId: ResponseId;
    requestId: RequestId;
    statusCode: StatusCode;
    responseTime: number;
    timestamp?: Date;
  }) {
    this.responseId = params.responseId.value;
    this.requestId = params.requestId.value;
    this.statusCode = params.statusCode;
    this.responseTime = params.responseTime;
    this.timestamp = params.timestamp ?? new Date();
  }

  /**
   * Serializes the event to a plain object.
   */
  public toJSON(): ResponseSentJSON {
    return {
      eventType: this.eventType,
      responseId: this.responseId,
      requestId: this.requestId,
      statusCode: this.statusCode,
      responseTime: this.responseTime,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

/**
 * JSON representation of ResponseSent event.
 */
export interface ResponseSentJSON {
  eventType: string;
  responseId: string;
  requestId: string;
  statusCode: StatusCode;
  responseTime: number;
  timestamp: string;
}
