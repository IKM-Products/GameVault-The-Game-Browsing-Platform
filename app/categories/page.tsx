// app/categories/page.tsx

import Link from "next/link";
import { Gamepad2, Grid3X3, Sword, Trophy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    name: "Action",
    slug: "action",
    description: "Fast-paced games with combat, reflexes, and adventure.",
    icon: Sword,
  },
  {
    name: "Adventure",
    slug: "adventure",
    description: "Story-driven games focused on exploration and quests.",
    icon: Gamepad2,
  },
  {
    name: "RPG",
    slug: "role-playing-rpg",
    description: "Role-playing games with characters, leveling, and deep stories.",
    icon: Trophy,
  },
  {
    name: "Shooter",
    slug: "shooter",
    description: "First-person and third-person shooting games.",
    icon: Gamepad2,
  },
  {
    name: "Strategy",
    slug: "strategy",
    description: "Games based on planning, tactics, and smart decisions.",
    icon: Grid3X3,
  },
  {
    name: "Sports",
    slug: "sport",
    description: "Football, racing, basketball, and other sports games.",
    icon: Trophy,
  },
];

export default function CategoriesPage() {
  return (
    <main className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Game Categories</h1>
        <p className="mt-2 text-muted-foreground">
          Browse games by genre and discover your next favorite title.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group"
            >
              <Card className="h-full border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <CardContent className="space-y-5 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-7 w-7" />
                    </div>

                    <Badge variant="secondary">Genre</Badge>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold group-hover:text-primary">
                      {category.name}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>
    </main>
  );
}