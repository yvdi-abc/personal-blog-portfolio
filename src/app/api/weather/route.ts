import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    const QWEATHER_KEY = process.env.QWEATHER_API_KEY || 'your-api-key-here';

    let location: string;
    let cityName: string;

    if (lat && lon) {
      // 使用经纬度查询
      location = `${lon},${lat}`;
      cityName = "当前位置";
    } else {
      // 默认使用北京
      location = '101010100'; // 北京城市ID
      cityName = "北京";
    }

    const url = `https://devapi.qweather.com/v7/weather/now?location=${location}&key=${QWEATHER_KEY}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 1800 } // 缓存30分钟
    });

    const data = await response.json();

    if (data.code === "200") {
      // 如果是经纬度查询，尝试获取城市名称
      if (lat && lon && data.location?.name) {
        cityName = data.location.name;
      }

      return NextResponse.json({
        code: "200",
        now: data.now,
        location: {
          name: cityName
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
