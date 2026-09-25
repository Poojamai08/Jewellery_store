const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const products = [
  {
    name: "Royal Temple Necklace",
    category: "Necklaces",
    price: 125000,
    metal: "22K Gold",
    weight: 32.5,
    sku: "AUR-NEC-001",
    stock: 4,
    description:
      "A timeless temple-inspired gold necklace crafted with intricate detailing for traditional and festive occasions.",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f",
    ],
  },
  {
    name: "Classic Gold Earrings",
    category: "Earrings",
    price: 48500,
    metal: "22K Gold",
    weight: 8.2,
    sku: "AUR-EAR-001",
    stock: 8,
    description:
      "Elegant classic gold earrings designed to complement both traditional and contemporary looks.",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908",
    ],
  },
  {
    name: "Celestial Diamond Ring",
    category: "Rings",
    price: 67500,
    metal: "18K Gold",
    weight: 5.4,
    sku: "AUR-RNG-001",
    stock: 5,
    description:
      "A sophisticated diamond ring combining refined craftsmanship with a timeless celestial-inspired design.",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
    ],
  },
  {
    name: "Heritage Gold Bracelet",
    category: "Bracelets",
    price: 82500,
    metal: "22K Gold",
    weight: 18.7,
    sku: "AUR-BRC-001",
    stock: 3,
    description:
      "A heritage-inspired gold bracelet featuring traditional craftsmanship and an elegant finish.",
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d",
    ],
  },
];

async function main() {
  console.log("Starting seed...");

  // -----------------------------
  // Seed Products
  // -----------------------------

  for (const product of products) {
    await prisma.product.upsert({
      where: {
        sku: product.sku,
      },
      update: product,
      create: product,
    });
  }

  console.log("Products seeded successfully!");

  // -----------------------------
  // Create Admin
  // -----------------------------

  const hashedPassword = await bcrypt.hash(
    "Aurelia@Admin123",
    10
  );

  await prisma.admin.upsert({
    where: {
      email: "admin@aurelia.com",
    },
    update: {
      name: "AURELIA Admin",
      password: hashedPassword,
    },
    create: {
      name: "AURELIA Admin",
      email: "admin@aurelia.com",
      password: hashedPassword,
    },
  });

  console.log("Admin created successfully!");
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });