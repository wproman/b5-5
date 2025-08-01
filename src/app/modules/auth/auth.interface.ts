
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
  // Driver-specific fields (optional)
  licenseNumber?: string;
  vehicleInfo?: {
    model: string;
    plate: string;
    color?: string;
  };
}

// export interface IAuthResponse {
//   user: Omit<IUser, 'password'>;
//   token: string;
// }