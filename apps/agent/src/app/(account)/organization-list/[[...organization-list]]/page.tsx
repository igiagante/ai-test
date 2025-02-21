'use client';

import { OrganizationList } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export default function OrganizationListPage() {
  const { resolvedTheme } = useTheme();

  return (
    <OrganizationList
      appearance={{
        baseTheme: resolvedTheme === 'dark' ? dark : undefined,
      }}
      hidePersonal={true}
      afterSelectOrganizationUrl="/"
    />
  );
}
