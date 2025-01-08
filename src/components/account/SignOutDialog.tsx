import React from 'react'
import { signOut } from 'next-auth/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { LogOut, AlertCircle } from 'lucide-react'

export default function SignOutDialog() {
  const [open, setOpen] = React.useState(false)

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 w-full p-2 rounded-md text-red-600 transition-colors hover:text-red-500">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="gap-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-xl">Sign Out Confirmation</DialogTitle>
          <DialogDescription className="text-center text-base">
            Are you sure you want to sign out of your account? You will need to sign in again to access your account and make purchases.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-28"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="w-full sm:w-28 bg-red-600 hover:bg-red-700 text-white hover:text-black transition-colors"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 