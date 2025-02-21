import {
  createOrganization,
  createUser,
  getOrganizationByDomain,
  getUserById,
  updateUser,
} from "@/lib/db/queries";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

const updateOnboardingComplete = async (userId: string) => {
  const client = await clerkClient();
  await client.users.updateUser(userId, {
    publicMetadata: {
      onboardingComplete: true,
    },
  });
};

const addUserToOrganization = async (
  userId: string,
  organizationId: string
) => {
  const client = await clerkClient();
  await client.organizations.createOrganizationMembership({
    organizationId,
    userId,
    role: "org:member",
  });
};

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const wh = new Webhook(SIGNING_SECRET);

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  if (evt.type === "user.created") {
    try {
      console.log("Creating user with data:", {
        id: evt.data.id,
        email: evt.data.email_addresses[0]?.email_address,
        firstName: evt.data.first_name,
        lastName: evt.data.last_name,
        imageUrl: evt.data.image_url,
      });

      await createUser({
        id: evt.data.id,
        email: evt.data.email_addresses[0]?.email_address ?? "",
        firstName: evt.data.first_name ?? "",
        lastName: evt.data.last_name ?? "",
        imageUrl: evt.data.image_url ?? "",
      });

      console.log("User created successfully in database");

      try {
        const userEmail = evt.data.email_addresses[0]?.email_address ?? "";

        const organization = await getOrganizationByDomain({
          domain: userEmail.split("@")[1]!,
        });

        if (organization) {
          try {
            try {
              await addUserToOrganization(evt.data.id, organization.id);
            } catch (err) {
              console.error("Error: Failed to add user to organization", err);
              return new Response("Error: Failed to add user to organization", {
                status: 500,
              });
            }

            await updateOnboardingComplete(evt.data.id);
          } catch (err) {
            console.error("Error: Failed to update user in database", err);
            return new Response("Error: Failed to update user in database", {
              status: 500,
            });
          }
        }
      } catch (error) {
        console.error("Error: Failed to get organization by domain", error);
        return new Response("Error: Failed to get organization by domain", {
          status: 500,
        });
      }
    } catch (err) {
      console.error("Error details:", err);
      console.error("Error: Failed to create user in database", err);
      return new Response("Error: Failed to create user in database", {
        status: 500,
      });
    }
  }

  if (evt.type === "user.updated") {
    try {
      await updateUser({
        id: evt.data.id,
        firstName: evt.data.first_name ?? "",
        lastName: evt.data.last_name ?? "",
        imageUrl: evt.data.image_url ?? "",
      });
    } catch (err) {
      console.error("Error: Failed to update user in database", err);
      return new Response("Error: Failed to update user in database", {
        status: 500,
      });
    }
  }

  if (evt.type === "organization.created") {
    try {
      const userId = evt.data.created_by;

      if (!userId) {
        throw new Error("Created by user not found");
      }

      const user = await getUserById({ id: userId });

      await createOrganization({
        id: evt.data.id,
        domain: user?.email.split("@")[1]!,
        slug: evt.data.slug,
        name: evt.data.name,
      });

      try {
        await updateOnboardingComplete(user?.id ?? "");
      } catch (err) {
        console.error("Error: Failed to update user in database", err);
        return new Response("Error: Failed to update user in database", {
          status: 500,
        });
      }
    } catch (err) {
      console.error("Error: Failed to create organization in database", err);
      return new Response("Error: Failed to create organization in database", {
        status: 500,
      });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
