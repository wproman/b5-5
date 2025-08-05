import { IUser } from "../users/user.interface";

// Location Interface
export interface ILocation {
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
}


// Extended Driver Interface
 export interface IDriver extends IUser {
  licenseNumber: string;
  vehicleInfo: {
    model: string;
    plate: string;
    color?: string;
  };
  approvalStatus: 'pending' | 'approved' | 'suspended';
  onlineStatus: boolean;
  currentLocation: {
    type: 'Point';
    coordinates: [number, number];
  };
   earnings: number
  rating?: number;
}

