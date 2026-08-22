import SearchBar from "@/components/SearchBar";
import ProfileCard from "@/components/ProfileCard";
import CloudPlayer from "@/components/CloudPlayer";
import LyricBar from "@/components/LyricBar";
import LatestPostsCarousel from "@/components/LatestPostsCarousel";
import LatestChatterCarousel from "@/components/LatestChatterCarousel";
import PhotoWallPreview from "@/components/PhotoWallPreview";
import ThemeToggleBlock from "@/components/ThemeToggleBlock";
import SiteDashboard from "@/components/SiteDashboard";
import WeatherWidget from "@/components/WeatherWidget";
import WebcamModeBlock from "@/components/WebcamModeBlock";
import ProjectsBlock from "@/components/ProjectsBlock";
import FriendsBlock from "@/components/FriendsBlock";
import TimelineBlock from "@/components/TimelineBlock";
import ContactBlock from "@/components/ContactBlock";
import { getAlbums, getChatters, getPhotoCount, getProjects } from "@/lib/content-repository";
import { getAllPosts } from "@/lib/posts";

export default async function Home() {
  const [allPosts, chatters, albums, projects] = await Promise.all([
    getAllPosts(),
    getChatters(),
    getAlbums(),
    getProjects(),
  ]);

  const top5Posts = allPosts.slice(0, 5);
  const chatterCount = chatters.length;
  const realPhotoCount = getPhotoCount(albums);

  return (
    <div className="min-h-screen relative pb-32">
      <div className="w-full max-w-6xl mx-auto mt-24 sm:mt-28 px-4 sm:px-6 lg:px-10 relative z-10">
        <SearchBar posts={allPosts} />

        <div className="flex flex-col gap-4 w-full mt-6">

          {/* 第一行：个人信息 + 播放器 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
            <div className="col-span-1 lg:col-span-7">
              <ProfileCard postCount={allPosts.length} chatterCount={chatterCount} photoCount={realPhotoCount} />
            </div>
            <div className="col-span-1 lg:col-span-5">
              <CloudPlayer />
            </div>
          </div>

          {/* 歌词栏 */}
          <div className="w-full">
            <LyricBar />
          </div>

          {/* 主内容区：照片墙 + 三个小组件（天气、日夜、背景）*/}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
            {/* 左侧：大照片墙 */}
            <div className="col-span-1 lg:col-span-6">
              <PhotoWallPreview albums={albums} />
            </div>

            {/* 右侧：三个功能小组件 */}
            <div className="col-span-1 lg:col-span-6 grid grid-cols-3 gap-4">
              <ThemeToggleBlock />
              <WebcamModeBlock />
              <WeatherWidget />
            </div>
          </div>

          {/* 文章和说说（左）+ 四个带图小组件（右）*/}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
            {/* 左侧：文章和说说 */}
            <div className="col-span-1 lg:col-span-6 grid grid-cols-2 gap-4">
              <LatestPostsCarousel posts={top5Posts} />
              <LatestChatterCarousel chatters={chatters} />
            </div>

            {/* 右侧：四个带图的小组件 */}
            <div className="col-span-1 lg:col-span-6 grid grid-cols-2 gap-4">
              <ProjectsBlock projectCount={projects.length} />
              <FriendsBlock />
              <TimelineBlock />
              <ContactBlock />
            </div>
          </div>

          {/* 站点仪表盘 */}
          <div className="w-full">
            <SiteDashboard />
          </div>

        </div>
      </div>
    </div>
  );
}
