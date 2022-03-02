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
  PRESENTATION = 'presentation_module_cache_failure',
  CHARGE_SESSION = 'charge_module_session_failure',
  LOCATION_FETCH = 'fetch_locations_failure',
}
