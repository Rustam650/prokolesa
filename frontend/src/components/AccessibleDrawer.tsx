import React from 'react';
import { Drawer, DrawerProps } from '@mui/material';

interface AccessibleDrawerProps extends DrawerProps {
  children: React.ReactNode;
  title?: string;
}

const AccessibleDrawer: React.FC<AccessibleDrawerProps> = ({ 
  children, 
  title = "Меню", 
  ...props 
}) => {
  return (
    <Drawer
      {...props}
      ModalProps={{
        keepMounted: true,
        disableAutoFocus: false,
        disableEnforceFocus: false,
        disableRestoreFocus: false,
        'aria-labelledby': 'drawer-title',
        'aria-describedby': 'drawer-description',
        ...props.ModalProps
      }}
      PaperProps={{
        role: 'dialog',
        'aria-label': title,
        ...props.PaperProps
      }}
    >
      <div role="document">
        {children}
      </div>
    </Drawer>
  );
};

export default AccessibleDrawer; 