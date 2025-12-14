import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  const [glitchText, setGlitchText] = useState("ACCESS");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [typedText, setTypedText] = useState("");
  const fullText = "> AUTHENTICATION REQUIRED_";

  // Glitch effect for main text
  useEffect(() => {
    const glitchChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~";
    const originalText = "ACCESS";
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        let newText = "";
        for (let i = 0; i < originalText.length; i++) {
          if (Math.random() > 0.8) {
            newText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
          } else {
            newText += originalText[i];
          }
        }
        setGlitchText(newText);
        setTimeout(() => setGlitchText(originalText), 100);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Typing effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden relative flex items-center justify-center">
      {/* Scanlines overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            #000 2px,
            #000 4px
          )`
        }}
      />

      {/* Animated grid background */}
      <div 
        className="fixed inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(#00ff41 1px, transparent 1px),
            linear-gradient(90deg, #00ff41 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridMove 20s linear infinite'
        }}
      />

      {/* Floating glitch blocks */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-[#00ff41]"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 8 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
              animation: `glitchBlock ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Error code */}
        <div className="mb-8">
          <span className="font-mono text-[#00ff41] text-sm tracking-[0.5em] uppercase opacity-60">
            Error Code
          </span>
          <div 
            className="font-mono text-[#ff0040] text-[12rem] sm:text-[16rem] font-black leading-none tracking-tighter"
            style={{
              textShadow: `
                0 0 10px #ff0040,
                0 0 20px #ff0040,
                0 0 40px #ff0040,
                4px 4px 0px #00ff41,
                -2px -2px 0px #00ff41
              `
            }}
          >
            401
          </div>
        </div>

        {/* Glitch text */}
        <div className="relative mb-8">
          <h1 
            className="font-display text-[4rem] sm:text-[6rem] lg:text-[8rem] font-black uppercase leading-[0.8] text-[#f5f5f0] tracking-tight"
            style={{
              textShadow: '4px 4px 0px #00ff41'
            }}
          >
            {glitchText}
          </h1>
          <h1 
            className="font-display text-[4rem] sm:text-[6rem] lg:text-[8rem] font-black uppercase leading-[0.8] text-[#f5f5f0] tracking-tight"
            style={{
              textShadow: '-4px -4px 0px #ff0040'
            }}
          >
            DENIED
          </h1>
          
          {/* Glitch copies for effect */}
          <div 
            className="absolute inset-0 font-display text-[4rem] sm:text-[6rem] lg:text-[8rem] font-black uppercase leading-[0.8] text-[#00ff41] tracking-tight opacity-50 pointer-events-none"
            style={{
              clipPath: 'inset(20% 0 60% 0)',
              transform: 'translateX(-4px)',
              animation: 'glitchTop 2s infinite linear alternate-reverse'
            }}
          >
            {glitchText}<br/>DENIED
          </div>
          <div 
            className="absolute inset-0 font-display text-[4rem] sm:text-[6rem] lg:text-[8rem] font-black uppercase leading-[0.8] text-[#ff0040] tracking-tight opacity-50 pointer-events-none"
            style={{
              clipPath: 'inset(60% 0 10% 0)',
              transform: 'translateX(4px)',
              animation: 'glitchBottom 3s infinite linear alternate-reverse'
            }}
          >
            {glitchText}<br/>DENIED
          </div>
        </div>

        {/* Terminal text */}
        <div className="mb-12 text-left max-w-md mx-auto">
          <div className="bg-black/80 border-2 border-[#00ff41] p-4 font-mono text-sm">
            <div className="text-[#00ff41] opacity-60 mb-2">
              // SYSTEM OUTPUT
            </div>
            <div className="text-[#f5f5f0]">
              {typedText}
              <span 
                className={`inline-block w-3 h-5 bg-[#00ff41] ml-1 align-middle ${
                  cursorVisible ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
            <div className="text-[#ff0040] mt-2 opacity-80">
              ! You must be logged in to access this area
            </div>
          </div>
        </div>

        {/* ASCII art divider */}
        <div className="font-mono text-[#00ff41] text-xs opacity-40 mb-12 overflow-hidden">
          <pre className="inline-block">
{`╔═══════════════════════════════════════════╗
║  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄  ║
║  █ UNAUTHORIZED ACCESS WILL BE LOGGED █  ║
║  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀  ║
╚═══════════════════════════════════════════╝`}
          </pre>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/login"
            className="group relative px-12 py-5 bg-[#00ff41] text-black font-display font-black text-xl uppercase tracking-wide border-4 border-[#00ff41] hover:bg-black hover:text-[#00ff41] transition-all duration-150"
            style={{
              boxShadow: '6px 6px 0px 0px #f5f5f0'
            }}
          >
            <span className="relative z-10">Login</span>
            <div className="absolute inset-0 bg-[#00ff41] opacity-0 group-hover:opacity-20 transition-opacity" />
          </Link>
          
          <Link
            to="/"
            className="group relative px-12 py-5 bg-transparent text-[#f5f5f0] font-display font-black text-xl uppercase tracking-wide border-4 border-[#f5f5f0] hover:bg-[#f5f5f0] hover:text-black transition-all duration-150"
            style={{
              boxShadow: '6px 6px 0px 0px #00ff41'
            }}
          >
            <span className="relative z-10">Sign Up</span>
          </Link>
        </div>

        {/* Bottom decoration */}
        <div className="mt-16 font-mono text-xs text-[#00ff41] opacity-30 tracking-widest uppercase">
          [ System Protocol v4.01 // Secure Access Required ]
        </div>
      </div>

      {/* Corner decorations */}
      <div className="fixed top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-[#00ff41] opacity-30" />
      <div className="fixed top-0 right-0 w-32 h-32 border-r-4 border-t-4 border-[#00ff41] opacity-30" />
      <div className="fixed bottom-0 left-0 w-32 h-32 border-l-4 border-b-4 border-[#ff0040] opacity-30" />
      <div className="fixed bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-[#ff0040] opacity-30" />

      {/* Inline styles for animations */}
      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        
        @keyframes glitchBlock {
          0%, 100% { 
            transform: translateX(0) scaleX(1);
            opacity: 0.1;
          }
          50% { 
            transform: translateX(20px) scaleX(1.5);
            opacity: 0.3;
          }
        }
        
        @keyframes glitchTop {
          0% { transform: translateX(-4px); }
          20% { transform: translateX(4px); }
          40% { transform: translateX(-2px); }
          60% { transform: translateX(6px); }
          80% { transform: translateX(-1px); }
          100% { transform: translateX(3px); }
        }
        
        @keyframes glitchBottom {
          0% { transform: translateX(4px); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(2px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default Unauthorized;

