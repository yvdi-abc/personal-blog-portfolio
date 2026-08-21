import ChatterBoard from './ChatterBoard';
import { chattersData } from '@/data/chatters';
import { siteConfig } from "@/siteConfig";

export const metadata = {
  title: "碎语 | " + siteConfig.title,
  description: "日常碎片与灵感记录",
};

export default function ChatterPage() {
  return (
    <div className="min-h-screen relative pb-20">
      <ChatterBoard chatters={chattersData} />
    </div>
  );
}
