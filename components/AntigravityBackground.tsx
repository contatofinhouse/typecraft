
import React, { useEffect, useRef } from 'react';

const AntigravityBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Particle[] = [];
    let animationFrameId: number;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    class Particle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
      text?: string;
      rotation: number;
      rotationSpeed: number;
      originalVy: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 20 + 10; // Slightly larger for better visibility
        
        // Base movement (Antigravity: float up slowly)
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() * -0.5) - 0.2; 
        this.originalVy = this.vy;
        
        const colors = [
          'rgba(59, 130, 246, 0.4)', // Blue
          'rgba(139, 92, 246, 0.4)', // Violet
          'rgba(236, 72, 153, 0.3)', // Pink
          'rgba(99, 102, 241, 0.3)'  // Indigo
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // TypeCraft theme: characters
        const chars = ['Aa', 'B', 'G', '&', '?', '¶', '{', '}', 'f', 'i'];
        if (Math.random() > 0.5) {
          this.text = chars[Math.floor(Math.random() * chars.length)];
        }

        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      }

      update() {
        // Mouse interaction (Repel)
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;

        if (distance < maxDist) {
          const force = (maxDist - distance) / maxDist;
          const angle = Math.atan2(dy, dx);
          
          this.vx -= Math.cos(angle) * force * 0.5;
          this.vy -= Math.sin(angle) * force * 0.5;
        }

        // Apply velocities
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        // Damping (return to normal float)
        this.vx *= 0.98;
        this.vy = this.vy * 0.98 + (this.originalVy * 0.02);

        // Boundary checks (wrap around)
        if (this.y < -50) {
          this.y = height + 50;
          this.x = Math.random() * width;
        } else if (this.y > height + 50) {
          this.y = -50;
        }

        if (this.x < -50) this.x = width + 50;
        if (this.x > width + 50) this.x = -50;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Blur for that soft "Google" feel
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        
        if (this.text) {
          ctx.font = `${this.radius * 1.5}px "Inter", sans-serif`;
          ctx.fillStyle = this.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(this.text, 0, 0);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        }
        
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      // Adjust density based on screen size
      const particleCount = Math.min(Math.floor((width * height) / 15000), 40);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    handleResize(); // Init
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        zIndex: 0, 
        opacity: 0.6,
        background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, rgba(255,255,255,0.02) 100%)' 
      }}
    />
  );
};

export default AntigravityBackground;
