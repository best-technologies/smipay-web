/**
 * Hook to fetch and manage user profile data
 */

import { useState, useEffect } from "react";
import { userApi } from "@/services/user-api";
import type { UserProfile } from "@/types/user";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await userApi.getProfile();
        if (response.success && response.data) {
          setProfile(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, isLoading, error };
}


