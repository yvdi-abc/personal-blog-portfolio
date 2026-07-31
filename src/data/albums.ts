export interface Photo { url: string; caption?: string; }
export interface Album { id: string; title: string; description: string; cover: string; date: string; photos: Photo[]; }

export const albums: Album[] = [
  {
    id: "summer-2026",
    title: "2026夏日记忆",
    description: "阳光、海滩与美好时光的视觉记录",
    cover: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=600&fit=crop",
    date: "2026.07",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=600&fit=crop",
        caption: "夕阳下的城市天际线"
      },
      {
        url: "https://images.unsplash.com/photo-1682687221038-404cb8830901?w=800&h=600&fit=crop",
        caption: "清晨的薄雾"
      },
      {
        url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=800&h=600&fit=crop",
        caption: "海边的金色余晖"
      }
    ]
  },
  {
    id: "urban-exploration",
    title: "都市探索",
    description: "记录城市中的每一个精彩瞬间",
    cover: "https://images.unsplash.com/photo-1682687221080-5cb261c645cb?w=800&h=600&fit=crop",
    date: "2026.06",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1682687221080-5cb261c645cb?w=800&h=600&fit=crop",
        caption: "霓虹闪烁的夜晚"
      },
      {
        url: "https://images.unsplash.com/photo-1682687220923-c58b9a4592ae?w=800&h=600&fit=crop",
        caption: "繁华的街道"
      },
      {
        url: "https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=800&h=600&fit=crop",
        caption: "现代建筑的线条美"
      }
    ]
  }
];
