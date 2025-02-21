'use client';

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from '@workspace/ui/components/sidebar';
import { BarChartIcon, BookOpenIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, ReactNode, useCallback } from 'react';

type NavigationItem = {
  title: string;
  url?: string;
  icon: ReactNode;
  isActive: boolean;
};

const navigationItems: NavigationItem[] = [
  {
    title: 'Analytics',
    url: '/analytics',
    icon: <BarChartIcon />,
    isActive: false,
  },
  {
    title: 'Library',
    url: '/library',
    icon: <BookOpenIcon />,
    isActive: false,
  },
  /* {
    title: 'Support',
    icon: <CircleHelpIcon />,
    isActive: false,
  }, */
];

export function Navigation() {
  const pathname = usePathname();

  const renderItem = useCallback(
    (item: NavigationItem) => (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.title}
          isActive={pathname.includes(item.title.toLowerCase())}
        >
          {item.icon}
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ),
    [pathname]
  );

  return navigationItems.map((item, index) => {
    return item.url ? (
      <Link key={`${item.title}-${index}`} href={`${item.url}`}>
        {renderItem(item)}
      </Link>
    ) : (
      <Fragment key={`${item.title}-${index}`}>{renderItem(item)}</Fragment>
    );
  });
}
