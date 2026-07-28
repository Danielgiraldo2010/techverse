export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  previousPrice?: number;
  stock: number;
  active: boolean;
  featured: boolean;
  image: string;
  images?: string[];
  features: string[];
  boxContents: string[];
}

const PRODUCT_PHOTOS = {
  pro3: Array.from({ length: 10 }, (_, index) => `/product-photos/airpods-pro-3/airpods-pro-3.${index}.JPG`),
  air4: [0, 1, 2, 5, 6].map((index) => `/product-photos/airpods-4/airpods-4.${index}.JPG`),
  pro2: Array.from({ length: 10 }, (_, index) => `/product-photos/airpods-pro-2/airpods-pro-2.${index}.JPG`),
  max: [
    "/product-photos/airpods-max/airpods-max1.JPG",
    "/product-photos/airpods-max/airpods-max2.JPG",
    "/product-photos/airpods-max/airpods-max3-negro.png",
    "/product-photos/airpods-max/airpods-max4-negro.png",
    "/product-photos/airpods-max/airpods-max5-estuche-blanco.png",
    "/product-photos/airpods-max/airpods-max6-estuche-negro.png"
  ]
};

export const products: Product[] = [
  {
    id: "pro3",
    slug: "airpods-pro-3",
    name: "AirPods Pro 3",
    shortDescription: "Ajuste con almohadillas y cancelación activa de ruido.",
    description: `• Rendimiento acústico revolucionario que transforma cualquier canción en una experiencia tridimensional envolvente.
• Graves potentes y nitidez vocal impresionante, para escuchar cada detalle.
• Cancelación Activa de Ruido que elimina distracciones y te sumerge completamente en el sonido.
• Ajuste personalizado con cinco tamaños de almohadillas, garantizando máxima comodidad y sujeción.
• Protección de salud auditiva, reduciendo automáticamente ruidos fuertes del entorno como sirenas o maquinaria.
• Compatibilidad total con iOS y Android, para que disfrutes un rendimiento premium sin importar tu dispositivo.
• Diseño casi idéntico a los originales, con reconocimiento inmediato en iPhone y apariencia elegante.
• Experiencia auditiva mágica con conexión instantánea al abrir el estuche y avisos sonoros que confirman el enlace, contesta llamadas, audio espacial personalizado.
• Duración de batería (auriculares): 3–5 horas de uso continuo.
• Duración de batería total (con estuche): Hasta 30 horas.
• Reconocimiento automático en iPhone: Compatible con iOS 18 o superior.
• Conectividad: Bluetooth, compatible con iOS y Android. Nota: Algunas funciones, como el reconocimiento en iPhone, los niveles de carga y la conexión automática, requieren iOS 18 o superior.
• Garantía de 2 meses por defectos de sistema, no cubre daños por mal uso.

Contenido de la caja:
• 2 Auriculares (Derecho e izquierdo)
• 1 Estuche de carga
• Almohadillas de silicona
• 1 Manual de usuario`,
    price: 84900,
    previousPrice: 142000,
    stock: 12,
    active: true,
    featured: true,
    image: PRODUCT_PHOTOS.pro3[0],
    images: PRODUCT_PHOTOS.pro3,
    features: [
      "Excelente calidad de sonido",
      "Contramarcados como los originales",
      "Personaliza el nombre de tus AirPods",
      "Compatible para iOS o Android",
      "Conexión Bluetooth",
      "Parlante integrado del estuche emite un sonido que te avisan si se enlazaron correctamente",
      "Encuentra tus audífonos con la función GPS en iPhone",
      "Compatible con carga inalámbrica",
      "Conexión automática en iPhone con solo abrir la tapa del estuche",
      "Control táctil para ajustar el volumen, reproducir o pausar",
      "Distancia de transmisión de Bluetooth: promedio 10 metros",
      "Cancelación de ruido pasiva",
      "Batería hasta 3-5 horas",
      "Función de ventaja emergente que muestra niveles de carga de estuche y audífonos en tu iPhone",
      "Tener en cuenta que al ser AirPods imitación tienen micrófono de calidad inferior",
      "Tamaño igual que los originales",
      "Físicamente igual a los originales",
      "El estuche de carga tiene un enganche para correa"
    ],
    boxContents: [
      "2 Auriculares (Derecho e izquierdo)",
      "1 Estuche de carga",
      "Almohadillas de silicona",
      "1 Manual de usuario"
    ]
  },
  {
    id: "air4",
    slug: "airpods-4",
    name: "AirPods 4",
    shortDescription: "Diseño abierto, controles táctiles y cancelación de ruido.",
    description: `• Contramarcados como los originales: Una apariencia similar a los AirPods auténticos, asegurando una experiencia visual similar.
  • Compatible con dispositivos iOS y Android: Funciona perfectamente con cualquier dispositivo, ya sea iPhone o Android, para una experiencia versátil.
  • Reconocimiento automático como los originales: Disfruta de la experiencia auténtica con un reconocimiento inmediato en tu iPhone al abrir el estuche, solo disponible con iOS 18 o superior.
  • Conexión automática en iPhone: Con solo abrir la tapa del estuche, se conectan instantáneamente a tu dispositivo, brindándote comodidad total.
  • Encuentra tus audífonos con la función GPS en iPhone: Nunca pierdas tus audífonos gracias a la función de localización en tu iPhone.
  • Excelente calidad de sonido: Disfruta de un sonido claro y nítido para todas tus actividades.
  • Batería de larga duración: Hasta 3-5 horas de uso continuo y hasta 30 horas con el estuche de carga para que no te quedes sin energía.
  • Parlante integrado en el estuche: Un sonido que te avisa cuando tus audífonos se han enlazado correctamente, asegurando que todo esté listo para usar.
  • Tamaño y diseño igual a los originales: Diseñados para que se vean y se sientan como los auténticos, con un tamaño perfectamente igual.
  • Función de niveles de carga: Visualiza el nivel de carga tanto del estuche como de los audífonos directamente en tu iPhone.
  • Compatible con carga inalámbrica: Recarga tus audífonos con comodidad, sin cables, usando cualquier cargador inalámbrico compatible.
  • Control táctil para volumen y reproducción: Ajusta el volumen, reproduce o pausa tu música fácilmente con un simple toque.
  • Distancia de transmisión Bluetooth de hasta 10 metros: Disfruta de libertad de movimiento sin perder calidad de conexión, incluso a distancia.
  • Micrófono: tener en cuenta que al ser AirPods imitación tienen micrófono de calidad inferior.
  • Personaliza el nombre de tus AirPods: Dale un toque personal, personaliza el nombre de tus audífonos directamente desde tu celular.

  Nota: Algunas funciones, como el reconocimiento en iPhone, los niveles de carga y la conexión automática, requieren iOS 18 o superior. Garantía de 2 meses por defectos de sistema, no cubre daños por mal uso.

  Contenido de la caja:
  • 2 Auriculares AirPods (Derecho e izquierdo)
  • 1 Estuche de carga
  • 1 Manual de usuario`,
    price: 74900,
    previousPrice: 88000,
    stock: 15,
    active: true,
    featured: false,
    image: PRODUCT_PHOTOS.air4[0],
    images: PRODUCT_PHOTOS.air4,
    features: [
      "Excelente calidad de sonido",
      "Contramarcados como los originales",
      "Personaliza el nombre de tus AirPods",
      "Compatible para iOS o Android",
      "Conexión Bluetooth",
      "Parlante integrado del estuche emite un sonido que te avisan si se enlazaron correctamente",
      "Encuentra tus audífonos con la función GPS en iPhone",
      "Compatible con carga inalámbrica",
      "Conexión automática en iPhone con solo abrir la tapa del estuche",
      "Control táctil para ajustar el volumen, reproducir o pausar",
      "Distancia de transmisión de Bluetooth: promedio 10 metros",
      "Cancelación de ruido pasiva",
      "Batería hasta 3-5 horas",
      "Función de ventaja emergente que muestra niveles de carga de estuche y audífonos en tu iPhone",
      "Tener en cuenta que al ser AirPods imitación tienen micrófono de calidad inferior",
      "Tamaño igual que los originales",
      "Físicamente igual a los originales",
      "El estuche de carga tiene un enganche para correa"
    ],
    boxContents: [
      "2 Auriculares AirPods (Derecho e izquierdo)",
      "1 Estuche de carga",
      "1 Manual de usuario"
    ]
  },
  {
    id: "pro2",
    slug: "airpods-pro-2",
    name: "AirPods Pro 2",
    shortDescription: "Versión anterior con gran sonido y ajuste cómodo.",
    description: `• Excelente calidad de sonido
• Contramarcados como los originales
• Personaliza el nombre de tus AirPods
• Compatible para iOS o Android
• Conexión Bluetooth
• Parlante integrado del estuche emite un sonido que te avisan si se enlazaron correctamente
• Encuentra tus audífonos con la función GPS en iPhone
• Compatible con carga inalámbrica
• Conexión automática en iPhone con solo abrir la tapa del estuche
• Control táctil para ajustar el volumen, reproducir o pausar
• Distancia de transmisión de Bluetooth: promedio 10 metros
• Cancelación de ruido pasiva
• Batería hasta 3-5 horas
• Función de ventaja emergente que muestra niveles de carga de estuche y audífonos en tu iPhone
• Tener en cuenta que al ser AirPods imitación tienen micrófono de calidad inferior
• Tamaño igual que los originales
• Físicamente igual a los originales
• El estuche de carga tiene un enganche para correa que te permite colgarlo de tu mochila o de tu bolso, y así tenerlo siempre a la mano
Garantía de 2 meses por defectos de sistema, no cubre daños por mal uso.

Contenido de la caja:
• 2 x auriculares airpods
• Almohadillas de cambio
• 1 x cable de carga tipo C
• 1 x estuche de carga
• 1 x manual de usuario`,
    price: 79900,
    previousPrice: 119900,
    stock: 10,
    active: true,
    featured: false,
    image: PRODUCT_PHOTOS.pro2[0],
    images: PRODUCT_PHOTOS.pro2,
    features: [
      "Excelente calidad de sonido",
      "Contramarcados como los originales",
      "Personaliza el nombre de tus AirPods",
      "Compatible para iOS o Android",
      "Conexión Bluetooth",
      "Parlante integrado del estuche emite un sonido que te avisan si se enlazaron correctamente",
      "Encuentra tus audífonos con la función GPS en iPhone",
      "Compatible con carga inalámbrica",
      "Conexión automática en iPhone con solo abrir la tapa del estuche",
      "Control táctil para ajustar el volumen, reproducir o pausar",
      "Distancia de transmisión de Bluetooth: promedio 10 metros",
      "Cancelación de ruido pasiva",
      "Batería hasta 3-5 horas",
      "Función de ventaja emergente que muestra niveles de carga de estuche y audífonos en tu iPhone",
      "Tener en cuenta que al ser AirPods imitación tienen micrófono de calidad inferior",
      "Tamaño igual que los originales",
      "Físicamente igual a los originales",
      "El estuche de carga tiene un enganche para correa"
    ],
    boxContents: [
      "2 x auriculares airpods",
      "Almohadillas de cambio",
      "1 x cable de carga tipo C",
      "1 x estuche de carga",
      "1 x manual de usuario"
    ]
  },
  {
    id: "max",
    slug: "airpods-max",
    name: "AirPods Max",
    shortDescription: "Diadema ajustable, sonido envolvente y aislamiento exterior.",
    description: "Diadema ajustable, sonido envolvente y aislamiento exterior.",
    price: 109900,
    previousPrice: 192000,
    stock: 8,
    active: true,
    featured: false,
    image: PRODUCT_PHOTOS.max[0],
    images: PRODUCT_PHOTOS.max,
    features: [
      "Conexión Bluetooth",
      "Aislamiento exterior",
      "Diadema ajustable",
      "Colores disponibles",
      "Incluye funda y cable de carga en la caja"
    ],
    boxContents: ["diadema", "funda protectora", "manual", "cable de carga en la caja"]
  }
];

export function getActiveProducts(): Product[] {
  return products.filter((product) => product.active);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductPrice(productId: string): number {
  const product = getProductById(productId);

  if (!product) {
    return 0;
  }

  return product.price;
}
