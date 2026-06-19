import { getPerfilOuRedirect } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getBarbeariaConfig, getServicos, getHorariosConfig } from "@/app/actions/config"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ToggleAtendeBarbeiro } from "@/components/painel/toggle-atende-barbeiro"
import { ConfigGeralForm } from "@/components/painel/config-geral-form"
import { ServicosForm } from "@/components/painel/servicos-form"
import { HorariosForm } from "@/components/painel/horarios-form"

export const dynamic = "force-dynamic"

export default async function ConfigPage() {
  const perfil = await getPerfilOuRedirect()
  if (perfil.role !== "owner") redirect("/painel")

  const [config, servicos, horarios] = await Promise.all([
    getBarbeariaConfig(),
    getServicos(),
    getHorariosConfig(),
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
    </div>
  )
}
