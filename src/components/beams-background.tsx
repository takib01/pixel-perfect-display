import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

function createBeam(width: number, height: number): Beam {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: 190 + Math.random() * 70,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  };
}

export function BeamsBackground({
  className,
  intensity = "strong",
}: {
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const opacityMap = { subtle: 0.45, medium: 0.8, strong: 1 };
    const MINIMUM_BEAMS = intensity === "subtle" ? 10 : 20;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      const total = Math.round(MINIMUM_BEAMS * 1.5);
      beamsRef.current = Array.from({ length: total }, () =>
        createBeam(canvas.width, canvas.height),
      );
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    function resetBeam(beam: Beam, index: number, totalBeams: number) {
      if (!canvas) return beam;
      const column = index % 3;
      const spacing = canvas.width / 3;
      beam.y = canvas.height + 100;
      beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
      beam.width = 100 + Math.random() * 100;
      beam.speed = 0.5 + Math.random() * 0.4;
      beam.hue = 190 + (index * 70) / totalBeams;
      beam.opacity = 0.2 + Math.random() * 0.1;
      return beam;
    }

    function drawBeam(c: CanvasRenderingContext2D, beam: Beam) {
      c.save();
      c.translate(beam.x, beam.y);
      c.rotate((beam.angle * Math.PI) / 180);
      const pulsing = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * opacityMap[intensity];
      const g = c.createLinearGradient(0, 0, 0, beam.length);
      g.addColorStop(0, `hsla(${beam.hue}, 85%, 65%, 0)`);
      g.addColorStop(0.1, `hsla(${beam.hue}, 85%, 65%, ${pulsing * 0.5})`);
      g.addColorStop(0.4, `hsla(${beam.hue}, 85%, 65%, ${pulsing})`);
      g.addColorStop(0.6, `hsla(${beam.hue}, 85%, 65%, ${pulsing})`);
      g.addColorStop(0.9, `hsla(${beam.hue}, 85%, 65%, ${pulsing * 0.5})`);
      g.addColorStop(1, `hsla(${beam.hue}, 85%, 65%, 0)`);
      c.fillStyle = g;
      c.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      c.restore();
    }

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = "blur(35px)";
      const total = beamsRef.current.length;
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < -100) resetBeam(beam, index, total);
        drawBeam(ctx, beam);
      });
      frameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [intensity]);

  return (
    <div className={cn("pointer-events-none fixed inset-0 overflow-hidden", className)}>
      <canvas ref={canvasRef} className="absolute inset-0" style={{ filter: "blur(15px)" }} />
      <div className="absolute inset-0 bg-background/10 backdrop-blur-[50px]" />
    </div>
  );
}
