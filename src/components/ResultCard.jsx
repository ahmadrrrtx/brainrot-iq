// src/components/ResultCard.jsx
import { useEffect, useRef, useState } from 'react';

export default function ResultCard({ results, tier, onReady }) {
  const canvasRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [generating, setGenerating] = useState(false);

  const generateCard = async () => {
    setGenerating(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = 1080;
    const H = 1080;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // ── Background ──
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#07070f');
    bg.addColorStop(0.5, '#0f0720');
    bg.addColorStop(1, '#07070f');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // ── Grid pattern ──
    ctx.strokeStyle = 'rgba(124,58,237,0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // ── Glow blobs ──
    const drawBlob = (x, y, r, color) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };
    drawBlob(200, 200, 350, 'rgba(124,58,237,0.18)');
    drawBlob(880, 800, 300, 'rgba(168,85,247,0.15)');
    drawBlob(900, 200, 250, 'rgba(236,72,153,0.10)');

    // ── Border ──
    const border = ctx.createLinearGradient(0, 0, W, H);
    border.addColorStop(0, 'rgba(124,58,237,0.6)');
    border.addColorStop(0.5, 'rgba(168,85,247,0.4)');
    border.addColorStop(1, 'rgba(236,72,153,0.6)');
    ctx.strokeStyle = border;
    ctx.lineWidth = 2;
    roundRect(ctx, 24, 24, W - 48, H - 48, 32);
    ctx.stroke();

    // Inner border
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    roundRect(ctx, 28, 28, W - 56, H - 56, 28);
    ctx.stroke();

    // ── Top badge ──
    drawPill(ctx, W / 2, 90, '🧠  BRAINROT IQ', 'rgba(124,58,237,0.3)', 'rgba(124,58,237,0.6)', '#c4b5fd', 22);

    // ── Tier emoji ──
    ctx.font = '130px serif';
    ctx.textAlign = 'center';
    ctx.fillText(tier.emoji, W / 2, 310);

    // ── Tier label ──
    ctx.font = 'bold 68px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    const titleGrad = ctx.createLinearGradient(200, 0, 880, 0);
    titleGrad.addColorStop(0, '#c4b5fd');
    titleGrad.addColorStop(0.5, '#e879f9');
    titleGrad.addColorStop(1, '#f9a8d4');
    ctx.fillStyle = titleGrad;
    ctx.fillText(tier.label, W / 2, 400);

    // ── Tier description ──
    ctx.font = '28px Inter, Arial, sans-serif';
    ctx.fillStyle = 'rgba(156,163,175,0.9)';
    ctx.fillText(tier.description, W / 2, 455);

    // ── Score circle ──
    const percentage = Math.round((results.correctCount / results.totalQuestions) * 100);
    drawScoreCircle(ctx, W / 2, 590, 110, percentage, results.correctCount, results.totalQuestions);

    // ── Stats row ──
    const stats = [
      { emoji: '🎯', label: 'Accuracy', value: `${percentage}%` },
      { emoji: '🔥', label: 'Best Streak', value: `${results.maxStreak || 0}x` },
      { emoji: '⚡', label: 'Difficulty', value: capitalize(results.difficulty || 'medium') },
    ];
    const statY = 780;
    const statSpacing = 280;
    const startX = W / 2 - statSpacing;

    stats.forEach((stat, i) => {
      const x = startX + i * statSpacing;
      drawStatBox(ctx, x, statY, stat);
    });

    // ── Divider ──
    const divGrad = ctx.createLinearGradient(120, 900, W - 120, 900);
    divGrad.addColorStop(0, 'transparent');
    divGrad.addColorStop(0.3, 'rgba(124,58,237,0.4)');
    divGrad.addColorStop(0.7, 'rgba(124,58,237,0.4)');
    divGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = divGrad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(120, 910);
    ctx.lineTo(W - 120, 910);
    ctx.stroke();

    // ── Bottom CTA ──
    ctx.font = 'bold 26px Inter, Arial, sans-serif';
    ctx.fillStyle = 'rgba(139,92,246,0.9)';
    ctx.textAlign = 'center';
    ctx.fillText('brainrot-iq.vercel.app', W / 2, 960);

    ctx.font = '22px Inter, Arial, sans-serif';
    ctx.fillStyle = 'rgba(107,114,128,0.8)';
    ctx.fillText('Can you beat my score? Test your brainrot IQ →', W / 2, 1000);

    // ── Watermark dots ──
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(W / 2 - 20 + i * 20, 1042, 3, 0, Math.PI * 2);
      ctx.fillStyle = i === 1 ? 'rgba(124,58,237,0.8)' : 'rgba(124,58,237,0.3)';
      ctx.fill();
    }

    const url = canvas.toDataURL('image/png', 1.0);
    setImageUrl(url);
    setGenerating(false);
    onReady?.(url);
  };

  useEffect(() => {
    if (results && tier) generateCard();
  }, [results, tier]); // eslint-disable-line

  return { canvasRef, imageUrl, generating, regenerate: generateCard };
}

// ── Helpers ──

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawPill(ctx, cx, cy, text, bgColor, borderColor, textColor, fontSize) {
  ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
  const tw = ctx.measureText(text).width;
  const pw = tw + 60;
  const ph = fontSize + 28;
  const px = cx - pw / 2;
  const py = cy - ph / 2;

  ctx.fillStyle = bgColor;
  roundRect(ctx, px, py, pw, ph, ph / 2);
  ctx.fill();

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1.5;
  roundRect(ctx, px, py, pw, ph, ph / 2);
  ctx.stroke();

  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.fillText(text, cx, cy + fontSize / 3);
}

function drawScoreCircle(ctx, cx, cy, r, percentage, correct, total) {
  // Outer glow
  const glow = ctx.createRadialGradient(cx, cy, r - 20, cx, cy, r + 40);
  glow.addColorStop(0, 'rgba(124,58,237,0.15)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 40, 0, Math.PI * 2);
  ctx.fill();

  // Track
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 12;
  ctx.stroke();

  // Progress arc
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (percentage / 100) * Math.PI * 2;
  const arcGrad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
  arcGrad.addColorStop(0, '#7c3aed');
  arcGrad.addColorStop(0.5, '#a855f7');
  arcGrad.addColorStop(1, '#ec4899');
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, endAngle);
  ctx.strokeStyle = arcGrad;
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Inner fill
  ctx.beginPath();
  ctx.arc(cx, cy, r - 18, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(7,7,15,0.9)';
  ctx.fill();

  // Score text
  ctx.font = 'bold 62px Inter, Arial, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(`${correct}/${total}`, cx, cy + 10);

  ctx.font = '22px Inter, Arial, sans-serif';
  ctx.fillStyle = 'rgba(167,139,250,0.9)';
  ctx.fillText(`${percentage}%`, cx, cy + 42);
}

function drawStatBox(ctx, cx, cy, stat) {
  const w = 200;
  const h = 110;
  const x = cx - w / 2;
  const y = cy - h / 2;

  // Box background
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  roundRect(ctx, x, y, w, h, 18);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, w, h, 18);
  ctx.stroke();

  // Emoji
  ctx.font = '30px serif';
  ctx.textAlign = 'center';
  ctx.fillText(stat.emoji, cx, y + 40);

  // Value
  ctx.font = 'bold 28px Inter, Arial, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(stat.value, cx, y + 75);

  // Label
  ctx.font = '18px Inter, Arial, sans-serif';
  ctx.fillStyle = 'rgba(107,114,128,0.8)';
  ctx.fillText(stat.label, cx, y + 100);
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}
