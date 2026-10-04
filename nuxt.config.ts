// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      htmlAttrs: { lang: "pt-BR" },
      title: "Saldo — suas finanças, à vista",
      meta: [
        {
          name: "description",
          content:
            "Organize receitas e despesas, acompanhe seu saldo e explore seus relatórios. Seus registros ficam neste navegador.",
        },
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
  typescript: { strict: true },
  telemetry: false,
});
