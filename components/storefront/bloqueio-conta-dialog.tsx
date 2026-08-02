import Link from "next/link"
import { User, UserPlus, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export function BloqueioContaDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <User className="h-6 w-6" />
          </div>
          <DialogTitle className="font-serif text-xl">Crie sua conta para agendar</DialogTitle>
          <DialogDescription>
            Para agendar um horário, você precisa estar logado. Leva menos de um minuto e você
            poderá acompanhar seus agendamentos depois.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button asChild className="w-full">
            <Link href="/conta/cadastro">
              <UserPlus className="h-4 w-4" /> Criar conta
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/conta/login">
              <LogIn className="h-4 w-4" /> Já tenho conta, entrar
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
