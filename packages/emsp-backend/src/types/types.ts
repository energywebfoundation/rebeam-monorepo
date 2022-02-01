// Create uniform objects for API error responses
export class ApiError {
  constructor(
    public readonly code: ApiErrorCode,
    public readonly message: string,
    public readonly error: object
  ) {}
}

// Machine-readable error codes for client
export enum ApiErrorCode {
  BAD_PAYLOAD = 'bad_payload',
  OCN_BRIDGE = 'ocn_bridge_failure',
}
