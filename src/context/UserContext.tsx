"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

// Define the types for the user data and context
export type UserData = {
  userId: string;
  name: string;
  age: number;
  sex: string;
  weight: number;
  height: number;
  bmi: number;
  profilePhoto: string;
  username: string;
  isVerified: boolean;
};

type UserContextType = {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  fetchUserData: (username: string) => Promise<void>;
  loading: boolean;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// UserProvider Component
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user data from API
  const fetchUserData = async (username: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/userInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
  
      const data = await response.json();
  
      if (data.success && data.user) {
        setUser(data.user);
        // Store only a token or minimal user data in localStorage (for example, use a JWT token)
      } else {
        throw new Error('User data not found or invalid.');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Function to logout and clear local storage
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Use effect to check for stored user data when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const { username } = JSON.parse(storedUser);
        if (username) {
          fetchUserData(username); // Fetch user data based on username from localStorage
          return;
        }
      } catch (e) {
        console.error('Error parsing stored user data:', e);
      }
    }
    setLoading(false); // If no stored user data, set loading to false
  }, []);

  // Provide the context values to child components
  return (
    <UserContext.Provider value={{ user, setUser, fetchUserData, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
