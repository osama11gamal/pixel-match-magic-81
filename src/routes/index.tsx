import { createFileRoute } from "@tanstack/react-router";
import { Experience } from "@/components/ishaq/Experience";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prince Ishaq — A Magical First Year" },
      { name: "description", content: "Open the enchanted storybook and celebrate Prince Ishaq's first birthday." },
      { property: "og:title", content: "Prince Ishaq — A Magical First Year" },
      { property: "og:description", content: "Open the enchanted storybook and celebrate Prince Ishaq's first birthday." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Experience,
});
