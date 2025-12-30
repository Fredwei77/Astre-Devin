import React, { useState, useEffect } from 'react';

/**
 * Tech-Zen / Celestial Minimalism Hero Section
 * 风格关键词：Modern Mystic, Dark Mode, Ethereal, Glassmorphism
 */
const HeroSection = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="relative min-h-screen w-full bg-[#0B0E14] overflow-hidden font-sans text-white">
            {/* --- Qi-Flow 背景层 (CSS 渐变动画) --- */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7000FF] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-[#00D1FF] rounded-full mix-blend-screen filter blur-[150px] opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-[20%] right-[15%] w-[30%] h-[30%] bg-[#D4AF37] rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>

                {/* 天体网格/星星背景 */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
            </div>

            {/* --- 玻璃拟态导航栏 (Glassmorphism Header) --- */}
            <header className={`fixed top-0 w-full z-50 transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                <nav className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center backdrop-blur-md border-b border-white/5">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] flex items-center justify-center">
                            <span className="text-[#D4AF37] text-xs font-serif">Ω</span>
                        </div>
                        <span className="text-xl font-bold tracking-widest uppercase">Destiny AI</span>
                    </div>

                    <div className="hidden md:flex space-x-8 text-sm tracking-wide opacity-80 font-medium">
                        {['Divination', 'Feng Shui', 'I-Ching', 'Calendar'].map((item) => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#D4AF37] transition-colors">{item}</a>
                        ))}
                    </div>

                    <button className="px-5 py-2 border border-white/20 rounded-full text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                        Join Nexus
                    </button>
                </nav>
            </header>

            {/* --- Hero 内容区 --- */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
                {/* 标题部分 - 使用 Playfair Display 风格 (需在 HTML 引入相关字体) */}
                <div className={`transition-all duration-1000 delay-300 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <h2 className="text-[#D4AF37] text-sm md:text-base tracking-[0.3em] uppercase mb-6 font-medium">
                        AI-Powered Celestial Intelligence
                    </h2>
                    <h1 className="text-5xl md:text-8xl font-serif leading-tight mb-8">
                        Sync Your Life with <br />
                        <span className="italic bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
                            Ancient Cosmic Flow
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 mb-12 font-light leading-relaxed">
                        Elevate your destiny with the fusion of high-dimensional neural networks and thousands of years of mystical wisdom.
                    </p>
                </div>

                {/* CTA 按钮与脉冲效果 */}
                <div className={`transition-all duration-1000 delay-500 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#7000FF] to-[#00D1FF] rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                        <button className="relative px-10 py-5 bg-black rounded-full leading-none flex items-center divide-x divide-gray-600">
                            <span className="pr-6 text-white text-lg tracking-widest font-medium">GET YOUR FREE ENERGY MAP</span>
                            <span className="pl-6 text-indigo-400 group-hover:text-white transition duration-200">
                                &rarr;
                            </span>
                        </button>
                    </div>

                    <p className="mt-8 text-xs text-white/30 tracking-widest uppercase">
                        Start your journey through the quantum stars.
                    </p>
                </div>
            </main>

            {/* --- 装饰性元素：底部流动线 --- */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4 opacity-50">
                <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>
                <span className="text-[10px] tracking-[0.5em] uppercase rotate-90 origin-left">Scroll</span>
            </div>

            {/* 自定义 Tailwind 补充样式 (通常放在 global.css) */}
            <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;600&display=swap');
        
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 5px rgba(112, 0, 255, 0.2); }
          50% { box-shadow: 0 0 20px rgba(112, 0, 255, 0.4); }
          100% { box-shadow: 0 0 5px rgba(112, 0, 255, 0.2); }
        }
      `}</style>
        </div>
    );
};

export default HeroSection;
