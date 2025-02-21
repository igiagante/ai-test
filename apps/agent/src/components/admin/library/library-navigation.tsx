'use client';

import { cn } from '@workspace/ui/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/library/chats', label: 'Chats' },
  { href: '/library/promotions', label: 'Promotions' },
];

export function LibraryNavigation() {
  const pathname = usePathname();

  return (
    <div className="flex items-center">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'hover:text-foreground text-muted-foreground rounded-sm p-1 px-2 text-sm',
            pathname === link.href && 'bg-muted text-foreground'
          )}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
