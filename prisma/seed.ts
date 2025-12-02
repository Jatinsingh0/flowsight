import { PrismaClient, OrderStatus, SubscriptionStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_PASSWORD = "Admin123";
const DEMO_PASSWORD = "demo123";

const demoUsers = [
  "Alice Carter",
  "John Patel",
  "Maria Gomez",
  "Liam Chen",
  "Sophia Reed",
  "Ethan Brooks",
  "Ava Singh",
  "Noah Bennett",
  "Olivia Flores",
  "Mason Clarke",
  "Harper Lewis",
  "Lucas Moreno",
  "Mia Rossi",
  "Henry Watts",
  "Chloe Turner",
  "Benjamin Lee",
  "Isabella Cruz",
  "Daniel Novak",
  "Grace Kim",
  "Oliver Hayes",
];

const subscriptionPlans = ["Starter", "Growth", "Scale"];

const orderAmounts = [19, 29, 49, 99, 149, 199];

const orderStatusPool = [
  OrderStatus.COMPLETED,
  OrderStatus.COMPLETED,
  OrderStatus.COMPLETED,
  OrderStatus.COMPLETED,
  OrderStatus.PENDING,
  OrderStatus.CANCELLED,
];

const activityTypes = [
  { action: "login", description: "Logged into FlowSight" },
  { action: "order", description: "Placed a new order" },
  { action: "subscription", description: "Started a subscription" },
  { action: "subscription_update", description: "Updated subscription plan" },
  { action: "billing", description: "Updated billing information" },
  { action: "support", description: "Contacted support" },
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDateWithin(days: number) {
  const now = new Date();
  const past = new Date();
  past.setDate(now.getDate() - days);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

function randomRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function createUsers(workspaceId: string) {
  const adminPasswordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const demoPasswordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const adminUser = await prisma.user.create({
    data: {
      name: "Demo Admin",
      email: "admin@flowsight.dev",
      password: adminPasswordHash,
      role: "ADMIN",
      workspaceId,
    },
  });

  const userPromises = demoUsers.map((name, index) => {
    const role = index % 6 === 0 ? "MANAGER" : "USER";

    return prisma.user.create({
      data: {
        name,
        email: `${name.toLowerCase().replace(/ /g, ".")}@demo.dev`,
        password: demoPasswordHash,
        role,
        workspaceId,
      },
    });
  });

  const createdUsers = await Promise.all(userPromises);

  return {
    admin: adminUser,
    users: createdUsers,
  };
}

async function createSubscriptions(users: { id: string }[], workspaceId: string) {
  const subscriptionsToCreate = users.slice(0, 14); // first 14 users get subscriptions

  const subscriptionPromises = subscriptionsToCreate.map((user, index) => {
    const plan = getRandomElement(subscriptionPlans);
    const statusPool = [
      SubscriptionStatus.ACTIVE,
      SubscriptionStatus.ACTIVE,
      SubscriptionStatus.ACTIVE,
      SubscriptionStatus.CANCELLED,
      SubscriptionStatus.EXPIRED,
    ];
    const status = statusPool[index % statusPool.length];
    const startDate = randomDateWithin(120);
    const endDate = new Date(startDate);

    if (status === SubscriptionStatus.ACTIVE) {
      // Ensure active subscriptions end in the future
      endDate.setDate(endDate.getDate() + randomRange(60, 120));
      if (endDate < new Date()) {
        const future = new Date();
        future.setDate(future.getDate() + randomRange(45, 90));
        endDate.setTime(future.getTime());
      }
    } else {
      // Ensure non-active subscriptions end after start but before now
      endDate.setDate(endDate.getDate() + randomRange(15, 60));
      if (endDate > new Date()) {
        const past = new Date();
        past.setDate(past.getDate() - randomRange(5, 20));
        endDate.setTime(past.getTime());
      }
    }

    return prisma.subscription.create({
      data: {
        userId: user.id,
        workspaceId,
        plan,
        status,
        startDate,
        endDate,
      },
    });
  });

  return Promise.all(subscriptionPromises);
}

async function createOrders(users: { id: string }[], workspaceId: string) {
  const totalOrders = 100;

  const orderPromises = Array.from({ length: totalOrders }).map(() => {
    const user = getRandomElement(users);
    const amount = getRandomElement(orderAmounts);
    const status = getRandomElement(orderStatusPool);
    const createdAt = randomDateWithin(90);

    return prisma.order.create({
      data: {
        userId: user.id,
        workspaceId,
        amount,
        status,
        createdAt,
      },
    });
  });

  return Promise.all(orderPromises);
}

async function createActivities(users: { id: string; name: string }[], workspaceId: string) {
  const totalActivities = 90;

  const activityPromises = Array.from({ length: totalActivities }).map(() => {
    const activity = getRandomElement(activityTypes);
    const user = getRandomElement(users);
    const createdAt = randomDateWithin(90);

    return prisma.activity.create({
      data: {
        userId: user.id,
        workspaceId,
        action: activity.action,
        description: `${activity.description} (${user.name})`,
        createdAt,
      },
    });
  });

  return Promise.all(activityPromises);
}

async function main() {
  console.log("🌱 Starting seed...");

  // Create or get demo workspace first
  const demoWorkspace = await prisma.workspace.upsert({
    where: { workspaceId: "workspace_demo" },
    update: {},
    create: {
      workspaceId: "workspace_demo",
      name: "Demo Workspace",
      realDataEnabled: false,
    },
  });

  console.log("✅ Created demo workspace");

  await prisma.activity.deleteMany({ where: { workspaceId: demoWorkspace.id } });
  await prisma.subscription.deleteMany({ where: { workspaceId: demoWorkspace.id } });
  await prisma.order.deleteMany({ where: { workspaceId: demoWorkspace.id } });
  await prisma.session.deleteMany();
  // Only delete users from demo workspace
  await prisma.user.deleteMany({ where: { workspaceId: demoWorkspace.id } });

  console.log("✅ Cleared existing demo data");

  const { admin, users } = await createUsers(demoWorkspace.id);
  console.log(`👤 Created admin user (${admin.email}) and ${users.length} demo users`);

  const subscriptions = await createSubscriptions(users, demoWorkspace.id);
  console.log(`🧾 Created ${subscriptions.length} subscriptions`);

  const orders = await createOrders(users, demoWorkspace.id);
  console.log(`💳 Created ${orders.length} orders`);

  const activities = await createActivities(users, demoWorkspace.id);
  console.log(`📋 Created ${activities.length} activity logs`);

  console.log("✅ Seed complete!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


