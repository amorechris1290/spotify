'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { getToken } from '@/services/auth.service';
import { Header } from '@/components/Header/Header';
import { TracksLoader } from '@/components/SkeletonLoader/TracksLoader';

const Callback = () => {
  const isMounted = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchToken = useCallback(async (code: string) => {
    await getToken(code);
    router.replace('/');
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      return;
    }

    const code = searchParams.get('code');

    if (code) {
      fetchToken(code);
    }

    isMounted.current = true;
  }, [searchParams]);

  return (
    <div>
      <Header />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mt-10">
        {Array.from({ length: 10 }, (_, index) => (
          <TracksLoader key={`loader-${index}`} />
        ))}
      </div>
    </div>
  );
};

export default Callback;
