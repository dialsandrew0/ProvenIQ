import React, { useEffect, useRef } from "react";

interface MagicCarpetBackdropProps {
  interactive?: boolean;
}

export default function MagicCarpetBackdrop({ interactive = true }: MagicCarpetBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle nodes for subtle celestial dust and constellation threads
    const particleCount = Math.min(65, Math.floor((width * height) / 22000));
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseAlpha: number;
      hue: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.8 + 0.6,
        baseAlpha: Math.random() * 0.45 + 0.15,
        hue: Math.random() > 0.6 ? 38 : Math.random() > 0.3 ? 198 : 225, // Gold, Cyan, Indigo
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);

    // Render loop
    let tick = 0;
    const render = () => {
      tick += 0.01;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Deep celestial velvet ambient gradient with breathing aurora centers
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.4,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, "#0c111c");
      bgGrad.addColorStop(0.5, "#07090e");
      bgGrad.addColorStop(1, "#040508");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle underglow clouds (gold & cyan magic carpet updrafts)
      const cloud1X = width * 0.3 + Math.sin(tick * 0.5) * 60;
      const cloud1Y = height * 0.35 + Math.cos(tick * 0.4) * 50;
      const rad1 = ctx.createRadialGradient(cloud1X, cloud1Y, 10, cloud1X, cloud1Y, 380);
      rad1.addColorStop(0, "rgba(245, 158, 11, 0.055)"); // Gold thermal
      rad1.addColorStop(1, "rgba(245, 158, 11, 0)");
      ctx.fillStyle = rad1;
      ctx.fillRect(0, 0, width, height);

      const cloud2X = width * 0.7 + Math.cos(tick * 0.6) * 70;
      const cloud2Y = height * 0.6 + Math.sin(tick * 0.5) * 50;
      const rad2 = ctx.createRadialGradient(cloud2X, cloud2Y, 10, cloud2X, cloud2Y, 440);
      rad2.addColorStop(0, "rgba(56, 189, 248, 0.045)"); // Cyan thermal
      rad2.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = rad2;
      ctx.fillRect(0, 0, width, height);

      // Draw floating stardust particles & delicate magnetic links
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges smoothly
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Subtle mouse repulsion / attraction
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && interactive) {
          p.x -= (dx / dist) * 0.4;
          p.y -= (dy / dist) * 0.4;
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.baseAlpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 65%, 0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles with subtle silk constellation threads
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist2 / 110) * 0.12;
            ctx.strokeStyle = `rgba(226, 232, 240, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
      style={{ opacity: 0.96 }}
    />
  );
}
