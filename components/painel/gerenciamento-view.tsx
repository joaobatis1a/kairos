"use client"

import { motion } from "framer-motion"
import { stagger, item } from "@/lib/motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ToggleAtendeBarbeiro } from "@/components/painel/toggle-atende-barbeiro"
import { ConfigGeralForm } from "@/components/painel/config-geral-form"
import { ServicosForm } from "@/components/painel/servicos-form"
import { HorariosForm } from "@/components/painel/horarios-form"
import type { BarbeariaConfig, ServicoDb, HorariosConfig } from "@/app/actions/config"

export function GerenciamentoView({
  atende,
  config,
  servicos,
  horarios,
}: {
  atende: boolean
  config: BarbeariaConfig
  servicos: ServicoDb[]
  horarios: HorariosConfig
}) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-6">
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Minha agenda</CardTitle>
            <CardDescription>Defina se você também aparece como profissional disponível para agendamentos.</CardDescription>
          </CardHeader>
          <CardContent>
            <ToggleAtendeBarbeiro atende={atende} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Informações gerais</CardTitle>
            <CardDescription>Nome, contato, endereço e redes sociais.</CardDescription>
          </CardHeader>
          <CardContent>
            <ConfigGeralForm config={config} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Serviços</CardTitle>
            <CardDescription>Adicione, edite ou remova os serviços oferecidos.</CardDescription>
          </CardHeader>
          <CardContent>
            <ServicosForm servicos={servicos} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Dias e horários</CardTitle>
            <CardDescription>Defina os dias de funcionamento e os horários disponíveis para agendamento.</CardDescription>
          </CardHeader>
          <CardContent>
            <HorariosForm config={horarios} />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
