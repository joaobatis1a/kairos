"use client"

import { motion } from "framer-motion"
import { stagger, item } from "@/lib/motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ToggleAtendeBarbeiro } from "@/components/painel/toggle-atende-barbeiro"
import { ConfigGeralForm } from "@/components/painel/config-geral-form"
import { LogoEmpresaUpload } from "@/components/painel/logo-empresa-upload"
import { ServicosForm } from "@/components/painel/servicos-form"
import { ProdutosForm } from "@/components/painel/produtos-form"
import { HorariosForm } from "@/components/painel/horarios-form"
import { FolgasForm } from "@/components/painel/folgas-form"
import type { BarbeariaConfig, ServicoDb, ProdutoDb, HorariosConfig } from "@/app/actions/config"
import type { Bloqueio } from "@/app/actions/bloqueios"

export function GerenciamentoView({
  atende,
  config,
  servicos,
  produtos,
  horarios,
  bloqueios,
  barbeiros,
}: {
  atende: boolean
  config: BarbeariaConfig
  servicos: ServicoDb[]
  produtos: ProdutoDb[]
  horarios: HorariosConfig
  bloqueios: Bloqueio[]
  barbeiros: { id: string; nome: string }[]
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
          <CardContent className="flex flex-col gap-4">
            <LogoEmpresaUpload logoUrl={config.logo_url} />
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
            <CardTitle className="font-serif">Produtos à venda</CardTitle>
            <CardDescription>Uma vitrine dos produtos vendidos no balcão — a venda continua sendo presencial.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProdutosForm produtos={produtos} />
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

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Folgas e bloqueios</CardTitle>
            <CardDescription>Bloqueie períodos da agenda — da barbearia inteira ou de um barbeiro específico.</CardDescription>
          </CardHeader>
          <CardContent>
            <FolgasForm bloqueios={bloqueios} barbeiros={barbeiros} />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
