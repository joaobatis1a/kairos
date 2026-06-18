import { getPerfilOuRedirect } from "@/lib/auth"
import { redirect } from "next/navigation"
import { barbearia, servicos, formatarPreco } from "@/config/barbearia"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Link2, Scissors, FileCode } from "lucide-react"
import { ToggleAtendeBarbeiro } from "@/components/painel/toggle-atende-barbeiro"

export const dynamic = "force-dynamic"

export default async function ConfigPage() {
  const perfil = await getPerfilOuRedirect()
  if (perfil.role !== "owner") redirect("/painel")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Dados do negócio, serviços e horários.</p>
      </div>

      {/* Toggle: owner como barbeiro */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Minha agenda</CardTitle>
          <CardDescription>
            Defina se você também aparece como profissional disponível para agendamentos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ToggleAtendeBarbeiro atende={perfil.atende_como_barbeiro ?? false} />
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-4">
          <FileCode className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm">
            <p className="font-medium">Como editar?</p>
            <p className="text-muted-foreground">
              Os dados abaixo ficam no arquivo{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">config/barbearia.ts</code>.
              Edite esse arquivo para alterar nome, contatos, serviços, preços e horários.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Informações gerais</CardTitle>
          <CardDescription>{barbearia.slogan}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <Info icon={Scissors} label="Nome" valor={barbearia.nome} />
          <Info icon={MapPin} label="Endereço" valor={barbearia.endereco} />
          <Info icon={Phone} label="Telefone / WhatsApp" valor={barbearia.telefone} />
          <Info icon={Link2} label="Instagram" valor={barbearia.instagram} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Serviços</CardTitle>
          <CardDescription>{servicos.length} serviços cadastrados</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {servicos.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
            >
              <div>
                <p className="font-medium">{s.nome}</p>
                <p className="text-xs text-muted-foreground">{s.duracaoMin} min</p>
              </div>
              <span className="font-semibold text-primary">{formatarPreco(s.preco)}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Horário de funcionamento</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {barbearia.funcionamento.map((f) => (
            <div key={f.dia} className="flex items-center justify-between gap-3 text-sm">
              <span>{f.dia}</span>
              <Badge variant="outline">{f.horas}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function Info({
  icon: Icon,
  label,
  valor,
}: {
  icon: React.ElementType
  label: string
  valor: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{valor}</p>
      </div>
    </div>
  )
}
