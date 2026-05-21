// src/components/ShareCard.jsx
import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShareCard({ results, tier, isOpen, onClose }) {
  const canvasRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && results && tier) {
      generateCard();
    }
  }, [isOpen, results, tier]); // eslint-disable-line

  const generateCard = async () => {
    setGenerating(true);
    setImageUrl(null);

    await new Promise(r => setTimeout(r, 50)); // allow render

    const canvas = canvasRef.current;
    if (!canvas) { setGenerating(false); return; }

    const W = 1080;
    const H = 1080;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // ── BACKGROUND ──
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#07070f');
    bg.addColorStop(0.45, '#0f0720');
    bg.addColorStop(1, '#07070f');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(124,58,237,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 54) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += 54) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Glow blobs
    drawRadialGlow(ctx, 160, 160, 380, 'rgba(124,58,237,0.20)');
    drawRadialGlow(ctx, 920, 880, 320, 'rgba(168,85,247,0.16)');
    drawRadialGlow(ctx, 950, 140, 260, 'rgba(236,72,153,0.12)');
    drawRadialGlow(ctx, 100, 900, 250, 'rgba(79,70,229,0.10)');

    // ── OUTER BORDER ──
    const outerBorder = ctx.createLinearGradient(0, 0, W, H);
    outerBorder.addColorStop(0, 'rgba(124,58,237,0.7)');
    outerBorder.addColorStop(0.5, 'rgba(168,85,247,0.5)');
    outerBorder.addColorStop(1, 'rgba(236,72,153,0.7)');
    ctx.strokeStyle = outerBorder;
    ctx.lineWidth = 2.5;
    drawRoundRect(ctx, 20, 20, W - 40, H - 40, 36);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    drawRoundRect(ctx, 26, 26, W - 52, H - 52, 30);
    ctx.stroke();

    // ── TOP SECTION ──
    // Logo pill
    drawPill(
      ctx, W / 2, 88,
      '🧠  BRAINROT IQ',
      'rgba(124,58,237,0.25)',
      'rgba(124,58,237,0.55)',
      '#c4b5fd', 24
    );

    // Player name
    const playerName = results.playerName || 'Anonymous';
    ctx.font = '500 30px Inter, Arial, sans-serif';
    ctx.fillStyle = 'rgba(156,163,175,0.7)';
    ctx.textAlign = 'center';
    ctx.fillText(`@${playerName}`, W / 2, 145);

    // ── TIER EMOJI ──
    ctx.font = '140px serif';
    ctx.textAlign = 'center';
    ctx.fillText(tier.emoji, W / 2, 310);

    // ── TIER TITLE ──
    ctx.font = 'bold 72px Inter, Arial, sans-serif';
    const titleG = ctx.createLinearGradient(180, 0, 900, 0);
    titleG.addColorStop(0, '#c4b5fd');
    titleG.addColorStop(0.5, '#e879f9');
    titleG.addColorStop(1, '#f9a8d4');
    ctx.fillStyle = titleG;
    ctx.textAlign = 'center';
    ctx.fillText(tier.label, W / 2, 408);

    // ── TIER DESCRIPTION ──
    ctx.font = '500 28px Inter, Arial, sans-serif';
    ctx.fillStyle = 'rgba(156,163,175,0.75)';
    ctx.fillText(tier.description, W / 2, 460);

    // ── SCORE CIRCLE ──
    const percentage = Math.round((results.correctCount / results.totalQuestions) * 100);
    drawScoreRing(ctx, W / 2, 600, 115, percentage, results.correctCount, results.totalQuestions);

    // ── STATS ROW ──
    const stats = [
      { emoji: '🎯', label: 'Accuracy', value: `${percentage}%` },
      { emoji: '🔥', label: 'Streak', value: `${results.maxStreak || 0}x` },
      { emoji: '💀', label: 'Difficulty', value: cap(results.difficulty || 'medium') },
    ];
    const sy = 790;
    const sx = [W / 2 - 290, W / 2, W / 2 + 290];
    stats.forEach((s, i) => drawStatCard(ctx, sx[i], sy, s));

    // ── DIVIDER ──
    const dg = ctx.createLinearGradient(100, 0, W - 100, 0);
    dg.addColorStop(0, 'transparent');
    dg.addColorStop(0.25, 'rgba(124,58,237,0.45)');
    dg.addColorStop(0.75, 'rgba(168,85,247,0.45)');
    dg.addColorStop(1, 'transparent');
    ctx.strokeStyle = dg;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 915); ctx.lineTo(W - 100, 915); ctx.stroke();

    // ── FOOTER ──
    ctx.font = 'bold 28px Inter, Arial, sans-serif';
    ctx.fillStyle = 'rgba(139,92,246,0.95)';
    ctx.textAlign = 'center';
    ctx.fillText('brainrot-iq.vercel.app', W / 2, 962);

    ctx.font = '500 22px Inter, Arial, sans-serif';
    ctx.fillStyle = 'rgba(107,114,128,0.75)';
    ctx.fillText('Can you beat my score? 👀', W / 2, 1002);

    // Dots
    [-16, 0, 16].forEach((dx, i) => {
      ctx.beginPath();
      ctx.arc(W / 2 + dx, 1040, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = i === 1 ? 'rgba(124,58,237,0.9)' : 'rgba(124,58,237,0.3)';
      ctx.fill();
    });

    const url = canvas.toDataURL('image/png', 1.0);
    setImageUrl(url);
    setGenerating(false);
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `brainrot-iq-${tier.label.toLowerCase().replace(/\s+/g, '-')}.png`;
    a.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handleCopyImage = async () => {
    if (!imageUrl) return;
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback - just download
      handleDownload();
    }
  };

  const handleShare = async () => {
    if (!imageUrl) return;
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], 'brainrot-iq.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'My BrainRot IQ Result',
          text: `I got "${tier.label}" on BrainRot IQ! Can you beat me? 🧠`,
          files: [file],
          url: 'https://brainrot-iq.vercel.app',
        });
      } else {
        handleDownload();
      }
    } catch (err) {
      if (err.name !== 'AbortError') handleDownload();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="relative z-10 w-full max-w-sm"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-black text-xl">🎴 Your Result Card</h2>
              <p className="text-gray-500 text-xs mt-0.5">Download & share on your story</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all text-sm"
            >
              ✕
            </button>
          </div>

          {/* Card Preview */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden mb-4 relative">
            {/* Hidden canvas for generation */}
            <canvas ref={canvasRef} className="hidden" />

            {generating ? (
              <div className="h-72 flex flex-col items-center justify-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full"
                />
                <p className="text-gray-500 text-sm">Generating your card...</p>
              </div>
            ) : imageUrl ? (
              <div className="relative group">
                <img
                  src={imageUrl}
                  alt="Your BrainRot IQ Result Card"
                  className="w-full rounded-2xl"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">1080 × 1080px</span>
                </div>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center">
                <p className="text-gray-600 text-sm">Failed to generate</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Primary - Download */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDownload}
              disabled={!imageUrl || generating}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {downloaded ? (
                <>✅ Downloaded!</>
              ) : (
                <>⬇️ Download Card (PNG)</>
              )}
            </motion.button>

            {/* Secondary row */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleShare}
                disabled={!imageUrl || generating}
                className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 text-gray-300 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-1.5"
              >
                📤 Share
              </button>
              <button
                onClick={handleCopyImage}
                disabled={!imageUrl || generating}
                className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 text-gray-300 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-1.5"
              >
                {copied ? '✅ Copied!' : '📋 Copy Image'}
              </button>
            </div>

            {/* Regenerate */}
            <button
              onClick={generateCard}
              disabled={generating}
              className="w-full py-2.5 text-gray-600 hover:text-gray-400 text-xs transition-colors"
            >
              ↻ Regenerate Card
            </button>
          </div>

          {/* Story tip */}
          <div className="mt-4 bg-violet-900/20 border border-violet-500/20 rounded-xl p-3 flex items-start gap-2">
            <span className="text-base flex-shrink-0">💡</span>
            <p className="text-gray-400 text-xs leading-relaxed">
              Perfect for Instagram Stories, Twitter/X, WhatsApp Status, or Snapchat. 1080×1080px square format.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Canvas Helpers ──

function drawRadialGlow(ctx, x, y, r, color) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawRoundRect(ctx, x, y, w, h, r) {
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

function drawPill(ctx, cx, cy, text, bg, border, textColor, fontSize) {
  ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
  const tw = ctx.measureText(text).width;
  const pw = tw + 64;
  const ph = fontSize + 30;
  const px = cx - pw / 2;
  const py = cy - ph / 2;
  ctx.fillStyle = bg;
  drawRoundRect(ctx, px, py, pw, ph, ph / 2);
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth = 1.5;
  drawRoundRect(ctx, px, py, pw, ph, ph / 2);
  ctx.stroke();
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.fillText(text, cx, cy + fontSize / 3);
}

function drawScoreRing(ctx, cx, cy, r, pct, correct, total) {
  // Glow
  const glow = ctx.createRadialGradient(cx, cy, r - 30, cx, cy, r + 50);
  glow.addColorStop(0, 'rgba(124,58,237,0.18)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 50, 0, Math.PI * 2);
  ctx.fill();

  // Track
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 14;
  ctx.stroke();

  // Arc
  const sa = -Math.PI / 2;
  const ea = sa + (pct / 100) * Math.PI * 2;
  const ag = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
  ag.addColorStop(0, '#7c3aed');
  ag.addColorStop(0.5, '#a855f7');
  ag.addColorStop(1, '#ec4899');
  ctx.beginPath();
  ctx.arc(cx, cy, r, sa, ea);
  ctx.strokeStyle = ag;
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Inner bg
  ctx.beginPath();
  ctx.arc(cx, cy, r - 22, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(7,7,15,0.92)';
  ctx.fill();

  // Score text
  ctx.font = 'bold 66px Inter, Arial, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(`${correct}/${total}`, cx, cy + 14);

  ctx.font = '500 24px Inter, Arial, sans-serif';
  ctx.fillStyle = 'rgba(167,139,250,0.9)';
  ctx.fillText(`${pct}%`, cx, cy + 48);
}

function drawStatCard(ctx, cx, cy, stat) {
  const w = 210;
  const h = 115;
  const x = cx - w / 2;
  const y = cy - h / 2;

  ctx.fillStyle = 'rgba(255,255,255,0.025)';
  drawRoundRect(ctx, x, y, w, h, 20);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  drawRoundRect(ctx, x, y, w, h, 20);
  ctx.stroke();

  ctx.font = '32px serif';
  ctx.textAlign = 'center';
  ctx.fillText(stat.emoji, cx, y + 42);

  ctx.font = 'bold 30px Inter, Arial, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(stat.value, cx, y + 78);

  ctx.font = '19px Inter, Arial, sans-serif';
  ctx.fillStyle = 'rgba(107,114,128,0.75)';
  ctx.fillText(stat.label, cx, y + 104);
}

function cap(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}
