"use client";
import { useEffect, useState } from 'react';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type Weather = 'sunny' | 'rainy' | 'snowy' | 'cloudy';

interface Particle {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
}

export default function WeatherEffects() {
  const [season, setSeason] = useState<Season>('spring');
  const [weather, setWeather] = useState<Weather>('sunny');
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // 根据月份自动判断季节
    const month = new Date().getMonth() + 1;
    let currentSeason: Season = 'spring';
    let currentWeather: Weather = 'sunny';

    if (month >= 3 && month <= 5) {
      currentSeason = 'spring';
      currentWeather = Math.random() > 0.5 ? 'sunny' : 'rainy';
    } else if (month >= 6 && month <= 8) {
      currentSeason = 'summer';
      currentWeather = Math.random() > 0.7 ? 'rainy' : 'sunny';
    } else if (month >= 9 && month <= 11) {
      currentSeason = 'autumn';
      currentWeather = 'cloudy';
    } else {
      currentSeason = 'winter';
      currentWeather = Math.random() > 0.6 ? 'snowy' : 'cloudy';
    }

    setSeason(currentSeason);
    setWeather(currentWeather);

    // 生成粒子效果
    if (currentWeather === 'rainy' || currentWeather === 'snowy') {
      const particleCount = currentWeather === 'snowy' ? 30 : 50;
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDuration: currentWeather === 'snowy' ? 8 + Math.random() * 4 : 1 + Math.random() * 1,
        animationDelay: Math.random() * 5,
        size: currentWeather === 'snowy' ? 4 + Math.random() * 4 : 1 + Math.random() * 2,
      }));
      setParticles(newParticles);
    }
  }, []);

  if (weather === 'sunny' || weather === 'cloudy') {
    return null; // 晴天和多云不显示粒子
  }

  return (
    <>
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) translateX(${weather === 'rainy' ? '20px' : '50px'});
            opacity: ${weather === 'rainy' ? '0.3' : '0.8'};
          }
        }
        .weather-particle {
          animation: fall linear infinite;
          will-change: transform;
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="weather-particle absolute rounded-full"
            style={{
              left: `${particle.left}%`,
              width: `${particle.size}px`,
              height: weather === 'rainy' ? `${particle.size * 3}px` : `${particle.size}px`,
              background: weather === 'rainy'
                ? 'linear-gradient(to bottom, rgba(174, 194, 224, 0.5), rgba(174, 194, 224, 0.8))'
                : 'rgba(255, 255, 255, 0.9)',
              animationDuration: `${particle.animationDuration}s`,
              animationDelay: `${particle.animationDelay}s`,
              borderRadius: weather === 'rainy' ? '50%/80%' : '50%',
              boxShadow: weather === 'snowy' ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none',
            }}
          />
        ))}
      </div>
    </>
  );
}
