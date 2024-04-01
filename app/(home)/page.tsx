'use client';

import { Header } from '@/components/Header/Header';
import { TracksLoader } from '@/components/SkeletonLoader/TracksLoader';
import { Track } from '@/components/Track/Track';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { saveTrack, searchTracks } from '@/services/tracks.service';
import { FilteredTrack } from '@/types/sharedTypes';
import { transformTrack } from '@/utils/helper.utils';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const isAuthenticated = useIsAuthenticated();
  const isMounted = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState<FilteredTrack[] | undefined>();

  useEffect(() => {
    if (!isAuthenticated || isMounted.current) {
      return;
    }

    setIsLoading(true);
    searchTracks('track').then((res) => {
      setTracks(res.tracks.items.map(transformTrack));
      setIsLoading(false);
    });

    isMounted.current = true;
  }, [isAuthenticated, tracks]);

  if (!isAuthenticated) {
    return (
      <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
        <Header />
        <h1 className="mx-8 mb-10 font-bold text-3xl">Please login to continue</h1>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header />
      <h1 className="mx-8 mb-10 font-bold text-3xl">Welcome Back!</h1>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mt-10">
          {Array.from({ length: 10 }, (loader) => (
            <TracksLoader key={`loader-${loader}`} />
          ))}
        </div>
      ) : (
        <div className="overflow-y-auto h-full p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4">
            {tracks?.map((searchedTrack) => <Track track={searchedTrack} key={searchedTrack.id} />)}
          </div>
        </div>
      )}
    </div>
  );
}
