import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

import { hashPassword } from "../src/helper";

(async () => {
  const prisma = new PrismaClient();

  // create user
  await prisma.user.upsert({
    where: { email: "fahmi@kodesiana.com" },
    update: {},
    create: {
      id: uuid(),
      email: "fahmi@kodesiana.com",
      name: "Fahmi",
      hashedPassword: await hashPassword("123456"),
    }
  });
})();
