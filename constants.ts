
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: "665671158f4a1b2c3d4e5f6a",
    name: "Причіп легковий Кремень ПЛ-2",
    slug: "prychip-lehkovyy-kremen-pl-2",
    sku: "KR-PL2",
    description: "<p>Надійний легковий причіп для транспортування різноманітних вантажів. Оснащений ресорною підвіскою та посиленою рамою.</p>",
    shortDescription: "Легковий причіп з ресорною підвіскою.",
    brand: "Кремень",
    model: "ПЛ-2",
    category: "Причепи",
    subCategory: "Легкові причепи",
    type: "product",
    price: 35000,
    currency: "UAH",
    inStock: true,
    quantity: 3,
    images: [
      "https://pragmatec.com.ua/media/catalog/product/cache/0010745a6aa2fece0194077071f0513f/n/n/nnn_8702.jpg"
    ],
    specifications: [
      { "name": "Вантажопідйомність", "value": "750", "unit": "кг" },
      { "name": "Довжина кузова", "value": "2000", "unit": "мм" },
      { "name": "Ширина кузова", "value": "1200", "unit": "мм" },
      { "name": "Висота борту", "value": "400", "unit": "мм" },
      { "name": "Тип підвіски", "value": "Ресорна" },
    ],
    metaTitle: "Купити легковий причіп Кремень ПЛ-2 в Україні",
    metaDescription: "Детальний опис та характеристики причепа Кремень ПЛ-2. Доставка по Україні.",
    keywords: [ "причіп", "легковий причіп", "Кремень", "ПЛ-2", "купити причіп" ],
    isFeatured: true,
    createdAt: "2024-05-29T20:00:00.000Z",
    updatedAt: "2024-05-29T21:00:00.000Z"
  },
  {
    id: "7a9c3e1b-8d2e-4f3a-9c1b-2a3d4e5f6g7h",
    name: "Причіп PRAGMATEC A2515",
    slug: "prychip-pragmatec-a2515",
    sku: "PR-A2515",
    description: "<p>Універсальний причіп PRAGMATEC A2515 для перевезення габаритних вантажів. Має оцинковану раму та торсіонну підвіску.</p>",
    shortDescription: "Універсальний причіп з торсіонною підвіскою.",
    brand: "PRAGMATEC",
    model: "A2515",
    category: "Причепи",
    subCategory: "Легкові причепи",
    type: "product",
    price: 42500,
    currency: "UAH",
    inStock: true,
    quantity: 5,
    images: [
      "https://pragmatec.com.ua/media/catalog/product/cache/0010745a6aa2fece0194077071f0513f/p/r/pricep_avto-sten_2515_bort_alyuminiy_vys_500_mm_dyshlo_v-obr_1_2.jpg"
    ],
    specifications: [
      { "name": "Вантажопідйомність", "value": "850", "unit": "кг" },
      { "name": "Довжина кузова", "value": "2500", "unit": "мм" },
      { "name": "Ширина кузова", "value": "1500", "unit": "мм" },
      { "name": "Тип підвіски", "value": "Торсіонна" },
    ],
    metaTitle: "Купити причіп PRAGMATEC A2515",
    metaDescription: "Опис та характеристики PRAGMATEC A2515.",
    keywords: [ "причіп", "pragmatec", "a2515" ],
    isFeatured: true,
    createdAt: "2024-05-30T10:00:00.000Z",
    updatedAt: "2024-05-30T11:00:00.000Z"
  },
  {
    id: "b1d4f6a8-9c7b-4e2a-8d5c-3f4g5h6i7j8k",
    name: "Причіп Лідер 2213",
    slug: "prychip-lider-2213",
    sku: "LD-2213",
    description: "<p>Компактний та надійний причіп Лідер 2213 для побутових потреб. Легкий у використанні, ресорна підвіска.</p>",
    shortDescription: "Компактний причіп для побутових потреб.",
    brand: "Лідер",
    model: "2213",
    category: "Причепи",
    subCategory: "Легкові причепи",
    type: "product",
    price: 29800,
    currency: "UAH",
    inStock: true,
    quantity: 8,
    images: [
      "https://pragmatec.com.ua/media/catalog/product/cache/0010745a6aa2fece0194077071f0513f/l/i/lider_2213_tent_1_1.jpg"
    ],
    specifications: [
      { "name": "Вантажопідйомність", "value": "600", "unit": "кг" },
      { "name": "Довжина кузова", "value": "2200", "unit": "мм" },
      { "name": "Тип підвіски", "value": "Ресорна" },
    ],
    metaTitle: "Купити причіп Лідер 2213",
    metaDescription: "Опис та характеристики Лідер 2213.",
    keywords: [ "причіп", "лідер", "2213" ],
    isFeatured: false,
    createdAt: "2024-05-31T12:00:00.000Z",
    updatedAt: "2024-05-31T13:00:00.000Z"
  },
  ...Array.from({ length: 17 }, (_, i): Product => {
    const brands = ["Кремень", "PRAGMATEC", "Лідер", "Авто-Стен", "Корида-Тех"];
    const models = ["ПЛ", "A", "T", "B"];
    const suspensionTypes = ["Ресорна", "Торсіонна"];
    const brand = brands[i % brands.length];
    const model = `${models[i % models.length]}-${2000 + i * 50}`;
    const name = `Причіп ${brand} ${model}`;
    const price = 30000 + i * 1250;
    const loadCapacity = 650 + i * 25;
    const suspension = suspensionTypes[i % suspensionTypes.length];

    return {
      id: `gen-trailer-${i + 1}`,
      name,
      slug: name.toLowerCase().replace(/\s/g, '-'),
      sku: `${brand.substring(0,2).toUpperCase()}-${model}`,
      description: `<p>Надійний причіп ${name} для широкого спектру завдань. Посилена конструкція та якісні матеріали.</p>`,
      shortDescription: `Причіп ${brand} з вантажопідйомністю ${loadCapacity} кг.`,
      brand,
      model,
      category: "Причепи",
      subCategory: 'Легкові причепи',
      type: 'product',
      price,
      currency: "UAH",
      inStock: i % 5 !== 0,
      quantity: 2 + i % 5,
      images: [
        i % 3 === 0 ? "https://pragmatec.com.ua/media/catalog/product/cache/0010745a6aa2fece0194077071f0513f/n/n/nnn_8702.jpg" : i % 3 === 1 ? "https://pragmatec.com.ua/media/catalog/product/cache/0010745a6aa2fece0194077071f0513f/k/r/krd-050121_1_1_2.jpg" : "https://pragmatec.com.ua/media/catalog/product/cache/0010745a6aa2fece0194077071f0513f/p/r/pricep_avto-sten_2515_bort_alyuminiy_vys_500_mm_dyshlo_v-obr_1_2.jpg"
      ],
      specifications: [
        { "name": "Вантажопідйомність", "value": `${loadCapacity}`, "unit": "кг" },
        { "name": "Довжина кузова", "value": `${2000 + i * 20}`, "unit": "мм" },
        { "name": "Ширина кузова", "value": `${1250 + i * 10}`, "unit": "мм" },
        { "name": "Висота борту", "value": "450", "unit": "мм" },
        { "name": "Тип підвіски", "value": suspension },
      ],
      metaTitle: `Купити причіп ${name} в Україні`,
      metaDescription: `Детальний опис та характеристики причепа ${name}.`,
      keywords: ["причіп", "легковий причіп", brand, model],
      isFeatured: i % 4 === 0,
      createdAt: "2024-06-01T09:00:00.000Z",
      updatedAt: "2024-06-01T10:00:00.000Z"
    };
  }),
  {
    id: "accessory-light-1",
    name: "Світлодіодний задній ліхтар 12В",
    slug: "svitlodiodnyy-zadniy-likhtar-12v",
    sku: "LED-LIGHT-12",
    description: "<p>Яскравий та надійний світлодіодний ліхтар для причепів. Водонепроникний корпус, низьке енергоспоживання. Легко монтується.</p>",
    shortDescription: "Світлодіодний задній ліхтар, універсальний.",
    brand: "W150",
    model: "DD",
    category: 'Комплектуючі',
    subCategory: 'Електрика та освітлення',
    type: 'spare_part',
    price: 450,
    currency: "UAH",
    inStock: true,
    quantity: 50,
    images: ["https://pragmatec.com.ua/media/catalog/product/cache/0010745a6aa2fece0194077071f0513f/l/i/likhtar_w150dd_1.jpg"],
    specifications: [
        { "name": "Напруга", "value": "12", "unit": "В" },
        { "name": "Тип лампи", "value": "LED" },
        { "name": "Функції", "value": "стоп, габарит, поворот" }
    ],
    compatibility: [
        "Універсальний для легкових причепів"
    ],
    metaTitle: "Купити світлодіодний задній ліхтар для причепа",
    metaDescription: "Світлодіодний задній ліхтар для причепів 12В. Універсальний, водонепроникний. Купити в Україні.",
    keywords: ["ліхтар", "стоп для причепа", "led", "комплектуючі"],
    isFeatured: true,
    createdAt: "2024-06-05T10:00:00.000Z",
    updatedAt: "2024-06-05T10:00:00.000Z"
  },
  {
    id: "accessory-wheel-1",
    name: "Колесо в зборі R13",
    slug: "koleso-v-zbori-r13",
    sku: "WHL-R13-175-70",
    description: "<p>Готове до встановлення колесо для легкового причепа. Включає диск та шину. Відбалансоване на заводі.</p>",
    shortDescription: "Колесо в зборі, R13, 175/70.",
    brand: "Rosava",
    model: "BC-11",
    category: 'Комплектуючі',
    subCategory: 'Колеса та маточини',
    type: 'spare_part',
    price: 2100,
    currency: "UAH",
    inStock: true,
    quantity: 25,
    images: ["https://pragmatec.com.ua/media/catalog/product/cache/0010745a6aa2fece0194077071f0513f/k/o/koleso_v_sbore_175-70-r13_1.jpg"],
    specifications: [
        { "name": "Діаметр диска", "value": "R13" },
        { "name": "Ширина шини", "value": "175", "unit": "мм" },
        { "name": "Профіль шини", "value": "70" },
        { "name": "Розболтовка", "value": "4x98" }
    ],
    compatibility: [
        "Сумісний з маточинами ВАЗ",
        "Підходить для причепів Кремень, Лідер та інших"
    ],
    metaTitle: "Купити колесо R13 для причепа в зборі",
    metaDescription: "Готове колесо R13 (175/70) для легкового причепа. Диск та шина в зборі. Доставка по Україні.",
    keywords: ["колесо", "запаска", "R13", "колесо для причепа"],
    isFeatured: false,
    createdAt: "2024-06-04T15:00:00.000Z",
    updatedAt: "2024-06-04T16:00:00.000Z"
  }
];
