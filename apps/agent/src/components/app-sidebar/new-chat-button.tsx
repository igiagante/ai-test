'use client';

import { Button, ButtonProps } from '@workspace/ui/components/button';
import { useSidebar } from '@workspace/ui/components/sidebar';
import { PlusIcon } from 'lucide-react';

export function NewChatButton(props: ButtonProps) {
  const { open } = useSidebar();

  return (
    <Button variant="outline" {...props}>
      {open ? 'New Chat' : <PlusIcon />}
    </Button>
  );
}
