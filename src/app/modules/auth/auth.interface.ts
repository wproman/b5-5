
// Auth Interfaces
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'rider' | 'driver';

  licenseNumber?: string;
  vehicleInfo?: {
    model: string;
    plate: string;
    color?: string;
  };
}

