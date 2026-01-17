// User Profile Types
export interface UserProfile {
  user: {
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    is_verified: boolean;
    phone_number: string;
    profile_image: string;
    gender: string;
    date_of_birth: string;
    joined: string;
    totalCards: number;
    totalAccounts: number;
    wallet_balance: number;
  };
  address: {
    id: string;
    house_no: string;
    city: string;
    state: string;
    country: string;
    house_address: string;
    postal_code: string;
  };
  kyc_verification: {
    id: string;
    is_active: boolean;
    status: string;
    id_type: string;
    id_number: string;
  };
  wallet_card: {
    id: string;
    current_balance: string;
    all_time_fuunding: string;
    all_time_withdrawn: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

