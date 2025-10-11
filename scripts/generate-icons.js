#!/usr/bin/env node

/**
 * Generate PWA icons from SVG
 * This script creates 192x192 and 512x512 PNG icons for the PWA
 *
 * For MVP, we're using simple colored squares with text.
 * In production, replace with professionally designed icons.
 */

import { writeFileSync } from 'fs';
import { createCanvas } from 'canvas';

function generateIcon(size, outputPath) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background (theme primary color)
  ctx.fillStyle = '#1a202e';
  ctx.fillRect(0, 0, size, size);

  // White text "RB"
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RB', size / 2, size / 2);

  // Accent circle (top right)
  ctx.fillStyle = '#60a5fa';
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.arc(size * 0.78, size * 0.22, size * 0.08, 0, Math.PI * 2);
  ctx.fill();

  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  writeFileSync(outputPath, buffer);
  console.log(`✅ Generated ${outputPath} (${size}x${size})`);
}

// Generate both sizes
generateIcon(192, 'client/public/icon-192x192.png');
generateIcon(512, 'client/public/icon-512x512.png');

console.log('\n✅ PWA icons generated successfully!');
console.log('Note: Replace with professional icons before production.');
