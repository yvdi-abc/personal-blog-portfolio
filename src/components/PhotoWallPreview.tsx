"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Camera } from 'lucide-react';

const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
  'https://images.unsplash.com/photo-1682687221038-404cb8830901',
  'https://images.unsplash.com/photo-1682687220063-4742bd7fd538',
  'https://images.unsplash.com/photo-1682687221080-5cb261c645cb',
];

interface PhotoWallPreviewProps {
  photoCount?: number;
}

export default function PhotoWallPreview({ photoCount = 24 }: PhotoWallPreviewProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push('/photos')}
      className="rounded-3xl glass p-6 relative overflow-hidden min-h-[280px] flex flex-col cursor-pointer hover:scale-[1.02] transition-all duration-700 group"
    >
      <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-pink-500/10 blur-[60px] rounded-full"></div>

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-pink-600 dark:text-pink-400 tracking-widest uppercase flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Photo Wall
          </h3>
          <span className="px-2 py-1 bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-bold rounded-lg">
            {photoCount} 张
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 flex-1">
          {SAMPLE_PHOTOS.map((photo, i) => (
            <div
              key={i}
              className="relative rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 aspect-square group-hover:scale-105 transition-transform duration-500"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <Image
                src={photo}
                alt={`Photo ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
            点击查看更多照片 →
          </span>
        </div>
      </div>
    </div>
  );
}
