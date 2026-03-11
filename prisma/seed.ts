const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create initial categories
  const categoriesToCreate = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Technology'];
  const createdCategories = [];
  
  for (const name of categoriesToCreate) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    createdCategories.push(category);
  }

  // Check if LibraryLayout exists
  const existingLayout = await prisma.libraryLayout.findFirst();

  if (!existingLayout) {
    await prisma.libraryLayout.create({
      data: {
        heroText: 'Welcome to Our Library',
        heroImg: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop',
        categories: {
          connect: createdCategories.map((c) => ({ id: c.id })),
        },
      },
    });
    console.log('Created initial LibraryLayout');
  } else {
    console.log('LibraryLayout already exists');
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
