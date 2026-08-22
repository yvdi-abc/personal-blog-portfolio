import ChatterBoard from './ChatterBoard';
import { getChatters } from '@/lib/content-repository';
import { siteConfig } from "@/siteConfig";

export const metadata = {
  title: "碎语 | " + siteConfig.title,
  description: "日常碎片与灵感记录",
};

export default async function ChatterPage() {
  const chatters = await getChatters();

  return (
    <div className="min-h-screen relative pb-20">
      <ChatterBoard chatters={chatters} />
    </div>
  );
}
