/**
 * Script to fix existing users with null workspaceId
 * 
 * Run this ONCE after schema migration:
 * npx tsx scripts/fix_existing_users.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixExistingUsers() {
  console.log("🔄 Fixing existing users without workspaceId...");

  try {
    // Get all users - we'll check each one
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });

    console.log(`📋 Found ${allUsers.length} users to check...`);

    let fixed = 0;
    let alreadyHasWorkspace = 0;

    for (const user of allUsers) {
      try {
        // Try to get user with workspaceId
        const userWithWorkspace = await prisma.user.findUnique({
          where: { id: user.id },
          select: { workspaceId: true },
        });

        // Check if workspaceId exists and is valid
        if (userWithWorkspace?.workspaceId) {
          const workspace = await prisma.workspace.findUnique({
            where: { id: userWithWorkspace.workspaceId },
          });
          if (workspace) {
            alreadyHasWorkspace++;
            continue;
          }
        }

        // User needs workspace - create it
        const workspaceId = `workspace_${user.id}`;
        const workspace = await prisma.workspace.upsert({
          where: { workspaceId },
          update: {},
          create: {
            workspaceId,
            name: `${user.email}'s Workspace`,
            realDataEnabled: false,
          },
        });

        // Update user with workspaceId
        await prisma.user.update({
          where: { id: user.id },
          data: { workspaceId: workspace.id },
        });

        fixed++;
        console.log(`✅ Fixed user: ${user.email}`);
      } catch (error: any) {
        console.error(`❌ Error fixing user ${user.email}:`, error.message);
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   - Fixed: ${fixed} users`);
    console.log(`   - Already had workspace: ${alreadyHasWorkspace} users`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

fixExistingUsers()
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

