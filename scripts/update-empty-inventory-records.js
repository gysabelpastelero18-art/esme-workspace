// Script to update inventory records with empty string fields to default values
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Set your default values here
  const defaultBranch = 'Mayon';
  const defaultDepartment = 'Bakery';
  const defaultGroup = 'RawMats';
  const defaultEncodedBy = 'Admin';
  const defaultCountedBy = 'Unknown';
  const defaultCheckedBy = 'Unknown';

  const updated = await prisma.inventory.updateMany({
    where: {
      OR: [
        { branch: '' },
        { department: '' },
        { group: '' },
        { encodedBy: '' },
        { countedBy: '' },
        { checkedBy: '' }
      ]
    },
    data: {
      branch: defaultBranch,
      department: defaultDepartment,
      group: defaultGroup,
      encodedBy: defaultEncodedBy,
      countedBy: defaultCountedBy,
      checkedBy: defaultCheckedBy
    }
  });
  console.log(`Updated ${updated.count} inventory records with empty fields.`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
