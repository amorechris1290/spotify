'use client';

import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { getSavedTracks, saveTrack } from '@/services/tracks.service';
import { FilteredTrack } from '@/types/sharedTypes';
import { transformTrack } from '@/utils/helper.utils';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface LibraryContextProps {
  tracks: FilteredTrack[] | undefined;
  isLoading: boolean;
  addToLibrary: (id: string) => void;
}

const LibraryContext = createContext<LibraryContextProps | undefined>(undefined);

interface LibraryProviderProps {
  children: ReactNode;
}

export const LibraryProvider: React.FC<LibraryProviderProps> = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState<FilteredTrack[] | undefined>();

  const getTracks = useCallback(() => {
    if (!isAuthenticated) {
      return;
    }

    setIsLoading(true);
    getSavedTracks().then((res) => {
      setTracks(res.items.map((item: any) => transformTrack(item.track)) || []);
      setIsLoading(false);
    });
  }, [isAuthenticated]);

  const addToLibrary = useCallback(
    async (id: string) => {
      await saveTrack(id);
      getTracks();
    },
    [getTracks]
  );

  useEffect(() => {
    getTracks();
  }, [isAuthenticated]);

  return <LibraryContext.Provider value={{ tracks, isLoading, addToLibrary }}>{children}</LibraryContext.Provider>;
};

export const useLibrary = (): LibraryContextProps => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
