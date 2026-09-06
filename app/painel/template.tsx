// template.tsx remonta a cada navegação (diferente de layout.tsx, que
// persiste) — é o que faz a classe .surgir tocar de novo toda vez que o
// conteúdo troca, em vez de só na primeira carga da sidebar.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="surgir">{children}</div>
}
