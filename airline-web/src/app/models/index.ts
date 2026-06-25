export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  url?: string;
}

export * from './airport.model';
export * from './booking.model';
export * from './flight.model';
