// app/profile/page.tsx

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Edit,
  Heart,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useVaultStore } from "@/stores/vault-store";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  const initial =
    user?.name?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "G";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  return (
    <main className="mx-auto max-w-6xl space-y-8">
      {/* Hero */}
      <Card className="overflow-hidden">
        <div className="h-44 bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600" />

        <CardContent className="relative p-8">
          <div className="-mt-24 flex flex-col gap-6 md:flex-row md:items-end">
            <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-primary shadow-2xl">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? "Profile"}
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-5xl font-bold text-primary-foreground">
                  {initial}
                </span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-bold">
                  {user?.name}
                </h1>

                <Badge className="gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </Badge>
              </div>

              <p className="mt-2 text-muted-foreground">
                {user?.email}
              </p>

              <div className="mt-4 flex gap-2">
                <Badge variant="secondary">
                  GameVault User
                </Badge>

                <Badge variant="outline">
                  Gamer
                </Badge>
              </div>
            </div>

            <Button asChild>
              <Link href="/profile/edit">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <ProfileStats />

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle>
            Account Information
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2">
          <InfoCard
            icon={<User className="h-5 w-5 text-primary" />}
            title="Full Name"
            value={user?.name ?? "Not Available"}
          />

          <InfoCard
            icon={<Mail className="h-5 w-5 text-primary" />}
            title="Email Address"
            value={user?.email ?? "Not Available"}
          />

          <InfoCard
            icon={<CalendarDays className="h-5 w-5 text-primary" />}
            title="Member Since"
            value={memberSince}
          />

          <InfoCard
            icon={<ShieldCheck className="h-5 w-5 text-primary" />}
            title="Account Status"
            value="Active"
          />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>
            Quick Actions
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <QuickAction
            href="/my-vault"
            title="My Vault"
            description="View your saved games"
          />

          <QuickAction
            href="/discover"
            title="Discover Games"
            description="Browse trending games"
          />

          <QuickAction
            href="/categories"
            title="Browse Categories"
            description="Explore games by genre"
          />
        </CardContent>
      </Card>
    </main>
  );
}

function ProfileStats() {
  const { games } = useVaultStore();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="rounded-xl bg-primary/10 p-3">
            <Heart className="h-8 w-8 text-primary" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              My Vault
            </p>

            <h3 className="text-3xl font-bold">
              {games.length}
            </h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="rounded-xl bg-primary/10 p-3">
            <CalendarDays className="h-8 w-8 text-primary" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Games Saved
            </p>

            <h3 className="text-3xl font-bold">
              {games.length}
            </h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="rounded-xl bg-primary/10 p-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Status
            </p>

            <h3 className="text-xl font-bold text-green-500">
              Active
            </h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border p-5">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <span className="text-sm text-muted-foreground">
          {title}
        </span>
      </div>

      <p className="font-semibold">
        {value}
      </p>
    </div>
  );
}

function QuickAction({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-accent"
    >
      <div>
        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </Link>
  );
}