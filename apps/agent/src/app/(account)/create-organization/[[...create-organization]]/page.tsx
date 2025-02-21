'use client';

import { CreateOrganization } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export default function CreateOrganizationPage() {
  const { resolvedTheme } = useTheme();

  return (
    <CreateOrganization
      appearance={{
        baseTheme: resolvedTheme === 'dark' ? dark : undefined,
      }}
      afterCreateOrganizationUrl="/"
    />
  );
}
