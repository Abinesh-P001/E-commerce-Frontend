import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting DairyFresh Database Seeding...');

  // 1. Clean existing records in reverse dependency order
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.address.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing records.');

  // Categories & Products Seed (Zero hardcoded demo credentials)

  // 5. Create Categories
  const categoriesData = [
    {
      name: 'Milk',
      slug: 'milk',
      description: '100% farm-fresh, non-homogenized pure cow and buffalo milk directly chilled within 2 hours of milking.',
      image: '/uploads/360/milk-360-01.svg',
    },
    {
      name: 'Curd & Yogurt',
      slug: 'curd-and-yogurt',
      description: 'Probiotic rich, thick cultured artisan dahi and Greek yogurt prepared using traditional pot fermentation.',
      image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Butter',
      slug: 'butter',
      description: 'Slow-churned, golden pasture butter and fresh white makhan crafted from sweet cream.',
      image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Cheese',
      slug: 'cheese',
      description: 'Artisanal aged cheddar, fresh bocconcini mozzarella, and creamy culinary cheeses.',
      image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Paneer',
      slug: 'paneer',
      description: 'Velvety soft, melt-in-mouth cottage cheese pressed naturally without artificial acidulants.',
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Ghee',
      slug: 'ghee',
      description: 'Handcrafted Vedic A2 Gir cow bilona ghee cooked over slow earthen woodfire stoves.',
      image: '/uploads/360/ghee-360-01.svg',
    },
    {
      name: 'Cream',
      slug: 'cream',
      description: 'Pasteurized heavy dairy cream with 35% natural butterfat, perfect for baking and rich culinary sauces.',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Buttermilk',
      slug: 'buttermilk',
      description: 'Traditional spiced and natural churned buttermilk refreshing you with digestive cumin and mint herbs.',
      image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Lassi',
      slug: 'lassi',
      description: 'Authentic thick Punjabi sweet and Alphonso mango lassi topped with hand-churned malai cream.',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Flavoured Milk',
      slug: 'flavoured-milk',
      description: 'Nutritious pasteurized whole milk infused with Kashmiri saffron, California almonds, and pure cocoa.',
      image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoryMap[cat.slug] = created.id;
  }

  console.log(`📦 Seeded ${categoriesData.length} dairy categories.`);

  // 6. Create Flagship 360-degree Milk Product
  const a2Milk = await prisma.product.create({
    data: {
      name: 'A2 Organic Farm Whole Milk (Glass Bottle)',
      slug: 'a2-organic-farm-whole-milk',
      description: 'Our signature whole milk sourced exclusively from pasture-raised indigenous Gir cows. Chilled directly to 4°C within 45 minutes of milking to preserve raw bio-active enzymes, beta-casein A2 proteins, and rich natural creaminess. Packaged in sanitized, eco-friendly glass bottles.',
      price: 85.0,
      discountPrice: 78.0,
      stock: 65,
      weight: '1000',
      unit: 'ml',
      ingredients: '100% Certified Organic Pasteurized Whole A2 Cow Milk. No added hormones, antibiotics, or synthetic preservatives.',
      nutrition: JSON.stringify({
        energy: '68 kcal',
        protein: '3.5 g',
        fat: '4.2 g',
        carbohydrates: '4.8 g',
        calcium: '125 mg',
        vitaminD: '2.0 mcg',
      }),
      storageInstructions: 'Keep refrigerated between 2°C and 4°C. Consume within 48 hours after opening.',
      deliveryInformation: 'Delivered in insulated cold-chain boxes before 7:00 AM daily.',
      mainImage: '/uploads/360/milk-360-01.svg',
      categoryId: categoryMap['milk'],
      active: true,
    },
  });

  // Attach 36 sequential 360-degree image frames to A2 Milk
  const milk360Frames = [];
  for (let i = 1; i <= 36; i++) {
    milk360Frames.push({
      productId: a2Milk.id,
      imageUrl: `/uploads/360/milk-360-${String(i).padStart(2, '0')}.svg`,
      imageIndex: i,
      imageType: 'VIEW_360',
    });
  }
  await prisma.productImage.createMany({ data: milk360Frames });

  // Add gallery images for A2 milk
  await prisma.productImage.createMany({
    data: [
      {
        productId: a2Milk.id,
        imageUrl: '/uploads/360/milk-360-01.svg',
        imageIndex: 0,
        imageType: 'MAIN',
      },
      {
        productId: a2Milk.id,
        imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
        imageIndex: 1,
        imageType: 'GALLERY',
      },
      {
        productId: a2Milk.id,
        imageUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=800&q=80',
        imageIndex: 2,
        imageType: 'GALLERY',
      },
    ],
  });

  // 7. Create Flagship 360-degree Vedic Cow Ghee
  const a2Ghee = await prisma.product.create({
    data: {
      name: 'Pure Bilona Desi Cow Ghee (Vedic A2)',
      slug: 'pure-bilona-desi-cow-ghee',
      description: 'Crafted according to classical Ayurvedic Bilona scriptures: whole A2 cow milk is cultured into curd, hand-churned in clockwise and anticlockwise cycles with a wooden bilona into makhana butter, and patiently clarified over slow earthen cow-dung flame. Aromatic, golden granular texture packed with fat-soluble vitamins A, D, E, and K.',
      price: 850.0,
      discountPrice: 799.0,
      stock: 40,
      weight: '500',
      unit: 'ml',
      ingredients: '100% Clarified Cultured Butterfat from Gir & Sahiwal Cow Milk.',
      nutrition: JSON.stringify({
        energy: '897 kcal',
        totalFat: '99.7 g',
        saturatedFat: '65.0 g',
        cholesterol: '190 mg',
        vitaminA: '800 mcg',
        omega3: '1.2 g',
      }),
      storageInstructions: 'Store in a cool dry place away from direct sunlight. No refrigeration required. Do not use wet spoons.',
      deliveryInformation: 'Dispatched in triple-bubble cushioned secure eco cartons.',
      mainImage: '/uploads/360/ghee-360-01.svg',
      categoryId: categoryMap['ghee'],
      active: true,
    },
  });

  // Attach 36 sequential 360-degree frames to Ghee
  const ghee360Frames = [];
  for (let i = 1; i <= 36; i++) {
    ghee360Frames.push({
      productId: a2Ghee.id,
      imageUrl: `/uploads/360/ghee-360-${String(i).padStart(2, '0')}.svg`,
      imageIndex: i,
      imageType: 'VIEW_360',
    });
  }
  await prisma.productImage.createMany({ data: ghee360Frames });

  await prisma.productImage.createMany({
    data: [
      {
        productId: a2Ghee.id,
        imageUrl: '/uploads/360/ghee-360-01.svg',
        imageIndex: 0,
        imageType: 'MAIN',
      },
      {
        productId: a2Ghee.id,
        imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
        imageIndex: 1,
        imageType: 'GALLERY',
      },
    ],
  });

  // 8. Other Realistic Products
  const otherProducts = [
    {
      name: 'Pasteurized Farm Fresh Toned Milk',
      slug: 'pasteurized-farm-fresh-toned-milk',
      description: 'Light, nutrient-dense toned milk with 3.0% fat and 8.5% SNF. Wholesome everyday choice for coffee, tea, and fitness diets.',
      price: 35.0,
      discountPrice: 32.0,
      stock: 120,
      weight: '500',
      unit: 'ml',
      ingredients: 'Standardized pasteurized cow milk.',
      mainImage: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
      categoryId: categoryMap['milk'],
    },
    {
      name: 'Probiotic Natural Set Curd (Clay Pot)',
      slug: 'probiotic-natural-set-curd',
      description: 'Slow-fermented artisan dahi set naturally inside porous terracotta earthenware that absorbs excess moisture, resulting in extraordinary thick, non-acidic curd.',
      price: 55.0,
      discountPrice: 48.0,
      stock: 50,
      weight: '400',
      unit: 'g',
      ingredients: 'Pasteurized whole milk, active live lactic cultures (L. bulgaricus, S. thermophilus).',
      mainImage: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=600&q=80',
      categoryId: categoryMap['curd-and-yogurt'],
    },
    {
      name: 'Artisanal Cultured Salted Butter',
      slug: 'artisanal-cultured-salted-butter',
      description: 'European-style churned golden butter cultured with live sourdough-style lactic starters and sprinkled with pure sea-salt flakes.',
      price: 110.0,
      discountPrice: 99.0,
      stock: 45,
      weight: '200',
      unit: 'g',
      ingredients: 'Cultured cream from grass-fed cows, natural sea salt.',
      mainImage: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
      categoryId: categoryMap['butter'],
    },
    {
      name: 'Fresh Malai Paneer (Vacuum Packed)',
      slug: 'fresh-malai-paneer',
      description: 'Cottage cheese prepared with organic lemon curdling. Ultra-soft crumbly texture that soaks up marinades and curries effortlessly.',
      price: 90.0,
      discountPrice: 84.0,
      stock: 75,
      weight: '200',
      unit: 'g',
      ingredients: 'Pasteurized whole cow milk, organic lemon juice.',
      mainImage: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
      categoryId: categoryMap['paneer'],
    },
    {
      name: 'Farmhouse Mild Cheddar Cheese Block',
      slug: 'farmhouse-mild-cheddar-cheese',
      description: 'Naturally aged for 4 months in our micro-dairy cellar. Creamy, smooth melting profile ideal for sandwiches, gourmet burgers, and boards.',
      price: 240.0,
      discountPrice: 215.0,
      stock: 30,
      weight: '200',
      unit: 'g',
      ingredients: 'Pasteurized cow milk, microbial veg rennet, salt, active cultures.',
      mainImage: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80',
      categoryId: categoryMap['cheese'],
    },
    {
      name: 'Rich Gourmet Whipping Cream 35% Fat',
      slug: 'rich-gourmet-whipping-cream',
      description: 'Pure dairy heavy whipping cream with sturdy stiff-peak holding power for high-end patisserie, desserts, and velvety pastas.',
      price: 125.0,
      discountPrice: null,
      stock: 40,
      weight: '250',
      unit: 'ml',
      ingredients: 'Fresh pasteurized cream (35% milk fat). No thickening gelatin.',
      mainImage: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
      categoryId: categoryMap['cream'],
    },
    {
      name: 'Masala Spiced Chaas (Chilled Pack)',
      slug: 'masala-spiced-chaas',
      description: 'Crisp, refreshing churned buttermilk infused with roasted Jeera, black rock salt, ginger extract, and fresh garden mint leaves.',
      price: 25.0,
      discountPrice: 20.0,
      stock: 90,
      weight: '250',
      unit: 'ml',
      ingredients: 'Cultured skimmed buttermilk, rock salt, roasted cumin, ginger, green chilli, curry leaves.',
      mainImage: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80',
      categoryId: categoryMap['buttermilk'],
    },
    {
      name: 'Royal Alphonso Mango Lassi',
      slug: 'royal-alphonso-mango-lassi',
      description: 'Devgad Alphonso mango pulp churned with rich thick curd and a hint of cardamom. No artificial food essence or added corn syrup.',
      price: 55.0,
      discountPrice: 49.0,
      stock: 60,
      weight: '250',
      unit: 'ml',
      ingredients: 'Whole milk curd, natural Alphonso mango pulp, sulphurless cane sugar, green cardamom.',
      mainImage: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
      categoryId: categoryMap['lassi'],
    },
    {
      name: 'Rich Kesar Pista Badam Milk',
      slug: 'rich-kesar-pista-badam-milk',
      description: 'Heritage saffron milk enriched with crushed pistachios, slivered almonds, and genuine Kashmiri saffron strands.',
      price: 50.0,
      discountPrice: 45.0,
      stock: 80,
      weight: '200',
      unit: 'ml',
      ingredients: 'Double toned milk, sugar, almonds (3%), pistachios (2%), Kashmiri saffron (0.05%).',
      mainImage: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
      categoryId: categoryMap['flavoured-milk'],
    },
  ];

  for (const prod of otherProducts) {
    const createdProd = await prisma.product.create({
      data: {
        ...prod,
        active: true,
        nutrition: JSON.stringify({ calories: '120 kcal', protein: '4g', calcium: '90mg' }),
        storageInstructions: 'Store refrigerated at 2°C-4°C.',
        deliveryInformation: 'Fresh early-morning doorstep drop.',
      },
    });

    await prisma.productImage.create({
      data: {
        productId: createdProd.id,
        imageUrl: prod.mainImage,
        imageIndex: 0,
        imageType: 'MAIN',
      },
    });
  }

  console.log(`🥛 Seeded Flagship 360° products and ${otherProducts.length} additional catalog products.`);

  // 9. Add Customer Reviews
  console.log('\n======================================================');
  console.log('✅ DATABASE SEEDING COMPLETE (Dairy_Fresh_Product)');
  console.log('   Zero demo credentials present.');
  console.log('   The first user to register via /register receives ADMIN role.');
  console.log('======================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
