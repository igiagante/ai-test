'use client';

import { UserProfile } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export default function UserProfilePage() {
  const { resolvedTheme } = useTheme();

  return (
    <UserProfile
      appearance={{
        baseTheme: resolvedTheme === 'dark' ? dark : undefined,
      }}
    />
  );
}
