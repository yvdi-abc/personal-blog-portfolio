import FriendsBoard from './FriendsBoard';
import { getFriends } from '@/lib/content-repository';
import { siteConfig } from "@/siteConfig";

export const metadata = {
  title: "友链 | " + siteConfig.title,
  description: "赛博空间里的有趣灵魂",
};

export default async function FriendsPage() {
  const friends = await getFriends();

  return (
    <div className="min-h-screen relative pb-20">
      <div className="mt-28">
        <FriendsBoard friends={friends} />
      </div>
    </div>
  );
}
