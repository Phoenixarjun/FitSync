"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

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

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

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
        localStorage.setItem('user', JSON.stringify({ username }));
      } else {
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const { username } = JSON.parse(storedUser);
        if (username) {
          fetchUserData(username);
          return;
        }
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
    setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserData, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};