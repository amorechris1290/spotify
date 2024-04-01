import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { searchTracks } from '@/services/tracks.service';
import { FilteredTrack, TrackType } from '@/types/sharedTypes';
import { transformTrack } from '@/utils/helper.utils';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';

interface Props {
  setSearchedTracks: Dispatch<SetStateAction<FilteredTrack[] | undefined>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export const SearchBar: React.FC<Props> = ({ setSearchedTracks, setIsLoading }) => {
  const isAuthenticated = useIsAuthenticated();
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        let debounced = setTimeout(() => {
          searchTracks(searchInput).then((res) => {
            setSearchedTracks(res.tracks.items.map(transformTrack) || []);
            setIsLoading(false);
          });
        }, 1000);

        return () => clearTimeout(debounced);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    };

    searchInput ? fetchData() : setSearchedTracks([]);
  }, [searchInput]);

  return (
    <div>
      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-neutral-200"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-80 p-4 ps-10 text-sm text-neutral-100 border-transparent rounded-full bg-neutral-900 hover:border-gray-400 focus:ring-white focus:border-white focus:text-white transition-all"
          placeholder="What do you want to listen to?"
          onChange={(event) => {
            setSearchInput(event.target.value);
          }}
        />
      </div>
    </div>
  );
};
