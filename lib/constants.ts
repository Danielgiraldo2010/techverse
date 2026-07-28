export const STORE_CONFIG = {
  name: process.env.NEXT_PUBLIC_STORE_NAME ?? "TECHVERSE",
  slogan: "Tecnología sin límites",
  whatsapp: process.env.NEXT_PUBLIC_STORE_WHATSAPP ?? "573122889457"
};

export const TRANSFER_PAYMENT_CONFIG = {
  whatsapp: "573122889457",
  accounts: [
    {
      name: "DaviPlata",
      account: "100100100",
      owner: "TECHVERSE"
    },
    {
      name: "Bancolombia Breve",
      account: "100100100",
      owner: "TECHVERSE"
    },
    {
      name: "Nequi",
      account: "100100100",
      owner: "TECHVERSE"
    }
  ]
};

export const SITE_PATHS = {
  home: "/",
  checkout: "/checkout",
  paymentResult: "/pago/resultado"
};

export const WOMPI_PATHS = {
  checkoutUrl: "https://checkout.wompi.co/p/"
};

export const MERCADOPAGO_PATHS = {
  checkoutUrl: "https://www.mercadopago.com.co/checkout/v1/redirect"
};
