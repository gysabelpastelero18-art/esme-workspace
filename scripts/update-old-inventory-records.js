// Script to update old inventory records with missing branch, department, group, encodedBy, countedBy, checkedBy
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
        { branch: null },
        { department: null },
        { group: null },
        { encodedBy: null },
        { countedBy: null },
        { checkedBy: null }
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
  console.log(`Updated ${updated.count} old inventory records.`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
