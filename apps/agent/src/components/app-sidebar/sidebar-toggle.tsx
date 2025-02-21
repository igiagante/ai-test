'use client';

import {
  SidebarMenuButton,
  useSidebar,
} from '@workspace/ui/components/sidebar';
import { SidebarLeftIcon } from '../icons';

export function SidebarToggle() {
  const { toggleSidebar, isMobile } = useSidebar();

  return isMobile ? (
    <SidebarMenuButton onClick={toggleSidebar} tooltip="Analytics">
      <SidebarLeftIcon />
    </SidebarMenuButton>
  ) : null;
}
