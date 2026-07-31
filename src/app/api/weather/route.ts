import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 使用和风天气免费API
    // 这里使用北京的城市ID：101010100
    const QWEATHER_KEY = process.env.QWEATHER_API_KEY || 'your-api-key-here';
    const CITY_ID = '101010100'; // 北京

    const url = `https://devapi.qweather.com/v7/weather/now?location=${CITY_ID}&key=${QWEATHER_KEY}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 1800 } // 缓存30分钟
    });

    const data = await response.json();

    if (data.code === "200") {
      return NextResponse.json({
        code: "200",
        now: data.now,
        location: {
          name: "北京"
        }
      });
    } else {
      throw new Error('Weather API Error');
    }
  } catch (error) {
    console.error('Weather API error:', error);
    // 返回模拟数据
    return NextResponse.json({
      code: "200",
      now: {
        temp: "22",
        text: "晴",
        icon: "100"
      },
      location: {
        name: "模拟数据"
      }
    });
  }
}
