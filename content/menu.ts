/**
 * Carta oficial de LUCA. Fuente: /design/menu.md (CARTA OFICIAL FINAL WEB.pdf).
 * Precios en euros como número; se formatean al pintar.
 */

export type WinePrice = { glass: number; bottle: number };

export type MenuItem = {
  name: string;
  price: number | WinePrice;
  description?: string;
};

export type MenuGroup = {
  title?: string;
  items: MenuItem[];
};

export type MenuCategory = {
  id: string;
  title: string;
  /** "dishes" → tarjetas con descripción; "list" → listado compacto (bebidas). */
  layout: "dishes" | "list";
  groups: MenuGroup[];
  note?: string;
};

export const menu: MenuCategory[] = [
  {
    id: "pizze",
    title: "Le nostre pizze",
    layout: "dishes",
    groups: [
      {
        items: [
          { name: "La Margherita", price: 13.5, description: "Tomate San Marzano, mozzarella fior di latte, Parmigiano Reggiano, albahaca fresca y AOVE" },
          { name: "Quattro Mestiza", price: 13.5, description: "Base blanca, mozzarella fior di latte, parmigiano, gorgonzola, artesano viejo, miel de romero" },
          { name: "Prosciutto Funghi", price: 15, description: "Tomate San Marzano, mozzarella fior di latte, Parmigiano, champiñones, cherrys, prosciutto y albahaca" },
          { name: "Carbonara", price: 15, description: "Base bianca, mozzarella fior di latte, guanciale, albahaca, crema de yema, pecorino y pimienta" },
          { name: "La Diabla", price: 15, description: "San Marzano, mozzarella fior di latte, Spianata Piccante, queso de oveja tostado, aceite picante artesano y albahaca fresca" },
          { name: "De Luca", price: 15, description: "Calabaza asada, tomate amarillo, mozzarella fior di latte, provolone, papada ibérica, nueces caramelizadas y albahaca" },
          { name: "La Hortelana", price: 16, description: "Base de crema fina de espárragos silvestres, mozzarella Fior di Latte, cintas de calabacín fresco, emulsión de guisantes de huerta, puntos de Ricotta di Bufala y semillas de calabaza" },
          { name: "La Divina", price: 18, description: "Base bianca con mozzarella fior di latte, mortadella de Bologna, burrata fresca en el centro, lascas de Parmigiano Reggiano y crujiente de pistacho" },
        ],
      },
    ],
  },
  {
    id: "apertura",
    title: "Apertura",
    layout: "dishes",
    groups: [
      {
        items: [
          { name: "La Burrata", price: 12, description: "Burrata pugliese sobre tomates datterini maduros y pesto di pistacchio" },
          { name: "Focaccia e Pomodoro", price: 7.5, description: "Nuestra masa horneada al estilo focaccia con tomate y un toque de orégano" },
          { name: "Antipasti (2 personas)", price: 20, description: "Selección de embutidos italianos artesanos variados DOP/IGP, Burrata di Puglia, pesto fresco, tomates secos y nuestros panecillos horneados al momento" },
        ],
      },
    ],
  },
  {
    id: "dolci",
    title: "El final feliz",
    layout: "dishes",
    groups: [
      {
        items: [
          { name: "Il Tiramisù Tradizionale", price: 8, description: "Bizcocho Savoiardi, crema de mascarpone y un toque final de cacao y almendras" },
          { name: "Panna Cotta Coco-Mango-Lichi", price: 7, description: "Panna cotta de coco y mango, decorada con un brillante coulis de lichi" },
          { name: "Choco y Crema de Pistacho", price: 8, description: "Mousse de chocolate Guanaja 70% con crema de pistacho puro de Sicilia" },
        ],
      },
    ],
  },
  {
    id: "bevande",
    title: "Bebidas",
    layout: "list",
    note: "Fuori carta: consulta con el equipo las creaciones del mes.",
    groups: [
      {
        title: "Refrescos",
        items: [
          { name: "Coca-Cola", price: 3 },
          { name: "Coca-Cola Zero", price: 3 },
          { name: "Fanta", price: 3 },
          { name: "Fuztea Limón", price: 3 },
          { name: "Aquarius Limón", price: 3 },
          { name: "Tónica", price: 3 },
        ],
      },
      {
        title: "Agua",
        items: [
          { name: "Solán 50 cl", price: 2.5 },
          { name: "Solán con gas 33 cl", price: 3 },
        ],
      },
      {
        title: "Cervezas",
        items: [
          { name: "Mahou Cinco Estrellas", price: 3.5 },
          { name: "Alhambra Reserva 1925", price: 4 },
          { name: "Mahou 0,0", price: 3 },
          { name: "Mahou Tostada", price: 4 },
          { name: "Peroni Nastro Azzurro", price: 4.8 },
        ],
      },
      {
        title: "Vinos españoles",
        items: [
          { name: "Corcovo Airén", price: { glass: 3, bottle: 11 } },
          { name: "Corcovo Crianza Tempranillo", price: { glass: 3.5, bottle: 13 } },
        ],
      },
      {
        title: "Vinos italianos",
        items: [
          { name: "Vino Bianco", price: { glass: 6, bottle: 22.5 } },
          { name: "Vino Rosato", price: { glass: 4.5, bottle: 16.5 } },
          { name: "Vino Rosso", price: { glass: 5.5, bottle: 21 } },
        ],
      },
      {
        title: "Aperitivos y licores",
        items: [
          { name: "Limoncello di Amalfi", price: 2.5 },
          { name: "Amaretto", price: 2.5 },
          { name: "Fernet con Coca-Cola", price: 7 },
          { name: "Aperol Spritz", price: 7 },
        ],
      },
      {
        title: "Cafés e infusiones",
        items: [
          { name: "Espresso / Cortado / Con leche", price: 2.5 },
          { name: "Selección de tés e infusiones", price: 2.5 },
        ],
      },
    ],
  },
];
