// Service worker mínimo: só garante que o app é instalável e melhora a
// abertura em conexão ruim. NÃO cacheia nada dinâmico (agenda, disponibilidade,
// dados de empresa) — isso tem que vir sempre da rede, senão o cliente vê
// horário desatualizado. Só assets estáticos (JS/CSS/ícones) entram em cache.

const CACHE = "kairos-shell-v1"

self.addEventListener("install", (event) => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  )
  self.clients.claim()
})

function ehAssetEstatico(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname === "/icon.svg" ||
    url.pathname === "/pwa-icon" ||
    url.pathname === "/pwa-icon-maskable" ||
    url.pathname === "/apple-icon"
  )
}

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (!ehAssetEstatico(url)) return

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request)
      const fetchPromise = fetch(request)
        .then((resposta) => {
          if (resposta.ok) cache.put(request, resposta.clone())
          return resposta
        })
        .catch(() => cached)
      return cached || fetchPromise
    }),
  )
})
