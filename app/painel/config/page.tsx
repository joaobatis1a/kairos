import { getPerfilOuRedirect } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getBarbeariaConfig, getServicos, getHorariosConfig } from "@/app/actions/config"
import { listarUsuariosParaTransferencia } from "@/app/actions/equipe"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ToggleAtendeBarbeiro } from "@/components/painel/toggle-atende-barbeiro"
import { ConfigGeralForm } from "@/components/painel/config-geral-form"
import { ServicosForm } from "@/components/painel/servicos-form"
import { HorariosForm } from "@/components/painel/horarios-form"
import { TransferirOwner } from "@/components/painel/transferir-owner"
import { DeletarConta } from "@/components/deletar-conta"

export const dynamic = "force-dynamic"

export default async function ConfigPage() {
  const perfil = await getPerfilOuRedirect()
  if (perfil.role !== "owner") redirect("/painel")

  const [config, servicos, horarios, usuarios] = await Promise.all([
    getBarbeariaConfig(),
    getServicos(),
    getHorariosConfig(),
    listarUsuariosParaTransferencia(),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as informações da barbearia.</p>
      </div>

      {/* Toggle barbeiro */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Minha agenda</CardTitle>
          <CardDescription>Defina se você também aparece como profissional disponível para agendamentos.</CardDescription>
        </CardHeader>
        <CardContent>
          <ToggleAtendeBarbeiro atende={perfil.atende_como_barbeiro ?? false} />
        </CardContent>
      </Card>

      {/* Informações gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Informações gerais</CardTitle>
          <CardDescription>Nome, contato, endereço e redes sociais.</CardDescription>
        </CardHeader>
        <CardContent>
          <ConfigGeralForm config={config} />
        </CardContent>
      </Card>

      {/* Serviços */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Serviços</CardTitle>
          <CardDescription>Adicione, edite ou remova os serviços oferecidos.</CardDescription>
        </CardHeader>
        <CardContent>
          <ServicosForm servicos={servicos} />
        </CardContent>
      </Card>

      {/* Horários */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Dias e horários</CardTitle>
          <CardDescription>Defina os dias de funcionamento e os horários disponíveis para agendamento.</CardDescription>
        </CardHeader>
        <CardContent>
          <HorariosForm config={horarios} />
        </CardContent>
      </Card>

      {/* Zona de perigo */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="font-serif text-destructive">Zona de perigo</CardTitle>
          <CardDescription>Ações irreversíveis. Proceda com cuidado.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div>
            <p className="mb-2 text-sm font-medium">Transferir administrador</p>
            <p className="mb-3 text-xs text-muted-foreground">Passe o cargo para outro usuário. Sua conta vira cliente e você perde acesso ao painel.</p>
            <TransferirOwner usuarios={usuarios} />
          </div>
          <div className="border-t border-border pt-3">
            <p className="mb-2 text-sm font-medium">Deletar minha conta</p>
            <p className="mb-3 text-xs text-muted-foreground">Remove permanentemente sua conta. Transfira o cargo antes de deletar.</p>
            <DeletarConta />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
