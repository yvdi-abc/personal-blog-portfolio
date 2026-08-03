"use client";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { useRouter } from "next/navigation";

export default function TimelineBlock() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/timeline');
  };

  return (
    <CardContainer className="w-full h-full">
      <CardBody className="w-full h-full">
        <CardItem
          translateZ="50"
          className="w-full h-full"
        >
          <div
            onClick={handleClick}
            className="w-full h-full rounded-3xl backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl overflow-hidden transition-all duration-700 relative group cursor-pointer min-h-[280px]"
          >
            {/* 背景图片 */}
            <div className="absolute inset-0 z-0">
              <img
                src="/gallery/二次元/绯英1.jpg"
                alt="Timeline"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
              />
            </div>

            {/* 渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent dark:from-black/90 dark:via-black/50 group-hover:from-black/70 transition-colors duration-500 z-10"></div>

            {/* 内容 */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
              <CardItem translateZ="60" className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-orange-500/80 backdrop-blur-lg rounded-full text-[10px] text-white font-black uppercase tracking-widest shadow-lg">
                  Archive
                </span>
              </CardItem>
              <CardItem translateZ="80" as="h3" className="text-3xl font-bold text-white mb-2 underline decoration-orange-400">
                归档时光
              </CardItem>
              <CardItem translateZ="70" as="p" className="text-white/90 text-base">
                探索文章归档
              </CardItem>
            </div>
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
