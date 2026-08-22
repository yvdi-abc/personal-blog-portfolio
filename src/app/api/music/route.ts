import { NextRequest, NextResponse } from 'next/server';

const NET_EASE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Referer': 'https://music.163.com/',
};

type SongResult = {
  id: string;
  name?: string;
  artist?: string;
  cover?: string;
  url?: string;
  lrc?: string;
  error?: string;
};

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get('ids');
  if (!ids) {
    return NextResponse.json({ error: 'Missing ids parameter' }, { status: 400 });
  }

  const songIds = ids.split(',').map((id) => id.trim()).filter(Boolean);

  const results: SongResult[] = await Promise.all(
    songIds.map(async (songId): Promise<SongResult> => {
      try {
        const [detailRes, lrcRes] = await Promise.all([
          fetch(
            `https://music.163.com/api/song/detail/?id=${songId}&ids=[${songId}]`,
            { headers: NET_EASE_HEADERS, signal: AbortSignal.timeout(6000) }
          ),
          fetch(
            `https://music.163.com/api/song/lyric?id=${songId}&lv=-1&kv=-1&tv=-1`,
            { headers: NET_EASE_HEADERS, signal: AbortSignal.timeout(6000) }
          ).catch(() => null),
        ]);

        const detail = await detailRes.json();
        const song = detail.songs?.[0];

        if (!song) {
          return { id: songId, error: 'not_found' };
        }

        let lrcText = '';
        if (lrcRes && lrcRes.ok) {
          try {
            const lrcData = await lrcRes.json();
            lrcText = lrcData.lrc?.lyric || '';
          } catch {
            // 歌词可选，失败不影响
          }
        }

        const artistName = song.artists?.[0]?.name || '未知歌手';

        // 构建音乐 URL
        const musicUrl = `https://music.163.com/song/media/outer/url?id=${songId}.mp3`;

        // 优先使用代理，但同时提供原始 URL 作为备用
        const proxyUrl = `/api/music/proxy?url=${encodeURIComponent(musicUrl)}`;

        return {
          id: songId,
          name: song.name,
          artist: artistName,
          cover: song.album?.picUrl || '',
          url: proxyUrl,
          fallbackUrl: musicUrl, // 添加备用 URL
          lrc: lrcText,
        };
      } catch (error) {
        console.error(`获取歌曲 ${songId} 失败:`, error);
        return { id: songId, error: String(error) };
      }
    })
  );

  return NextResponse.json(results);
}
