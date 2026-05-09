import * as React from 'react'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'

interface PopupProps {
  children: React.ReactNode
  dialogClassName?: string
  drawerClassName?: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title?: string
}

const Popup: React.FC<PopupProps> = ({
  children,
  dialogClassName,
  drawerClassName,
  isOpen,
  onOpenChange,
  title,
}) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            'w-full min-w-[750px] max-h-[80vh] max-w-[90vw]  min-h-[300px] overflow-y-auto',
            dialogClassName,
          )}
        >
          {title && (
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
          )}
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className={cn('min-h-[300px]', drawerClassName)}>
        {title && (
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
        )}
        {children}
      </DrawerContent>
    </Drawer>
  )
}

export default Popup
