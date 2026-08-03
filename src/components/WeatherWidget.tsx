"use client";

import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Loader2, MapPin } from 'lucide-react';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

export default function WeatherWidget() {
  const [weather, setWeather] = useState<{ city: string; temp: number; text: string; icon: string; isMock: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // 尝试获取用户位置
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              // 使用用户位置获取天气
              const res = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
              const data = await res.json();

              if (data.code === "200" && data.now) {
                setWeather({
                  city: data.location?.name || "当前位置",
                  temp: parseInt(data.now.temp),
                  text: data.now.text,
                  icon: data.now.icon,
                  isMock: false
                });
              } else {
                throw new Error(data.message || "Data Error");
              }
              setLoading(false);
            },
            async (error) => {
              // 定位失败，使用默认位置
              console.warn('Geolocation error:', error);
              setLocationError(true);
              await fetchDefaultWeather();
            },
            {
              timeout: 5000,
              enableHighAccuracy: false
            }
          );
        } else {
          // 浏览器不支持定位
          await fetchDefaultWeather();
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
        // 降级到模拟模式
        setWeather({ city: "模拟数据", temp: 22, text: "晴", icon: "100", isMock: true });
        setLoading(false);
      }
    };

    const fetchDefaultWeather = async () => {
      try {
        const res = await fetch('/api/weather');
        const data = await res.json();

        if (data.code === "200" && data.now) {
          setWeather({
            city: data.location?.name || "北京",
            temp: parseInt(data.now.temp),
            text: data.now.text,
            icon: data.now.icon,
            isMock: false
          });
        } else {
          throw new Error(data.message || "Data Error");
        }
      } catch (err) {
        // 降级到模拟模式
        setWeather({ city: "模拟数据", temp: 22, text: "晴", icon: "100", isMock: true });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (iconCode: string) => {
    const code = parseInt(iconCode);
    if (code === 100) return <Sun className="text-amber-400" size={38} />;
    if (code >= 101 && code <= 104) return <Cloud className="text-slate-300" size={38} />;
    if (code >= 300 && code <= 399) return <CloudRain className="text-blue-400" size={38} />;
    if (code >= 400 && code <= 499) return <Snowflake className="text-indigo-200" size={38} />;
    if (code >= 150 && code <= 153) return <Sun className="text-orange-200" size={38} />;
    return <Cloud className="text-slate-400" size={38} />;
  };

  return (
    <CardContainer className="w-full h-full">
      <CardBody className="w-full h-full">
        <CardItem
          translateZ="50"
          className="w-full h-full"
        >
          <div className="w-full h-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-6 flex flex-col justify-center transition-all duration-700 group relative overflow-hidden">
            <div className={`absolute -right-6 -top-6 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${weather?.isMock ? 'bg-amber-500/20 group-hover:bg-amber-500/40' : 'bg-indigo-500/20 group-hover:bg-indigo-500/40'}`}></div>
            {loading ? (
               <div className="flex flex-col items-center gap-3 text-slate-500 w-full justify-center relative z-10">
                 <Loader2 className="animate-spin text-indigo-400" size={28} />
                 <span className="text-[10px] font-black tracking-widest uppercase">定位获取天气...</span>
               </div>
            ) : weather && (
              <div className="flex items-center justify-between relative z-10 w-full">
                <div className="flex flex-col flex-1 pr-2">
                  <CardItem translateZ="60" className="flex items-center gap-1 mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${weather.isMock ? 'text-amber-500' : 'text-indigo-500 dark:text-indigo-400'}`}>
                      {weather.isMock ? 'SIMULATED' : 'LIVE'}
                    </span>
                    {!weather.isMock && !locationError && (
                      <MapPin size={10} className="text-indigo-500 dark:text-indigo-400" />
                    )}
                  </CardItem>
                  <CardItem translateZ="70" as="span" className="text-base font-bold text-slate-800 dark:text-white line-clamp-1">{weather.city}</CardItem>
                  <CardItem translateZ="80" className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{weather.temp}°</span>
                    <span className="text-xs font-bold text-slate-500">{weather.text}</span>
                  </CardItem>
                </div>
                <CardItem translateZ="100" className="relative z-10 group-hover:scale-110 transition-transform duration-500 drop-shadow-md">
                  {getWeatherIcon(weather.icon)}
                </CardItem>
              </div>
            )}
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
