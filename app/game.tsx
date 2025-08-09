
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, LayoutChangeEvent, Platform } from 'react-native';
import { colors } from '../styles/commonStyles';
import ToastSprite from '../components/ToastSprite';
import HUD from '../components/HUD';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { getHighScore, setHighScore } from '../utils/storage';

type ObstaclePair = {
  id: number;
  x: number;
  gapY: number; // center of gap
  gapSize: number;
  width: number;
  scored?: boolean;
};

export default function GameScreen() {
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHS] = useState<number | null>(null);
  const [running, setRunning] = useState(false);

  // Toast physics
  const toastWidth = 56;
  const toastHeight = 44;
  const toastX = useMemo(() => 80, []);
  const toastYRef = useRef(0);
  const velYRef = useRef(0);

  // Loop
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  // Obstacles
  const obstaclesRef = useRef<ObstaclePair[]>([]);
  const nextIdRef = useRef(1);
  const spawnTimerRef = useRef(0);
  const speedRef = useRef(180); // px/sec base speed
  const spawnIntervalRef = useRef(1500); // ms
  const gapSizeRef = useRef(200);

  // Expose for rendering small updates
  const [tick, setTick] = useState(0);

  useEffect(() => {
    (async () => {
      const hs = await getHighScore();
      setHS(hs);
    })();
  }, []);

  const resetGame = useCallback(() => {
    console.log('Resetting game state');
    setScore(0);
    obstaclesRef.current = [];
    nextIdRef.current = 1;
    spawnTimerRef.current = 0;
    speedRef.current = 180;
    spawnIntervalRef.current = 1500;
    gapSizeRef.current = 200;
    velYRef.current = 0;
    toastYRef.current = dims.h > 0 ? dims.h * 0.4 : 200;
    lastTsRef.current = null;
    setRunning(true);
    setTick(t => t + 1);
  }, [dims.h]);

  const endGame = useCallback(async () => {
    setRunning(false);
    const finalScore = score;
    console.log('Ending game. Final score:', finalScore);
    if (typeof highScore === 'number') {
      if (finalScore > highScore) {
        await setHighScore(finalScore);
        setHS(finalScore);
      }
    } else {
      await setHighScore(finalScore);
      setHS(finalScore);
    }
    router.replace({ pathname: '/game-over', params: { score: String(finalScore) } });
  }, [highScore, score]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    console.log('Layout dimensions:', width, height);
    setDims({ w: width, h: height });
  };

  const flap = useCallback(() => {
    if (!running) return;
    velYRef.current = -420; // jump impulse
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  }, [running]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const onKey = (e: KeyboardEvent) => {
        if (!running) return;
        if (e.code === 'Space' || e.code === 'ArrowUp') {
          e.preventDefault();
          flap();
        }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, [running, flap]);

  const spawnObstacle = useCallback(() => {
    const margin = 60;
    const gapSize = gapSizeRef.current;
    const minY = margin + gapSize / 2;
    const maxY = dims.h - margin - gapSize / 2;
    const gapY = Math.max(minY, Math.min(maxY, Math.random() * (maxY - minY) + minY));
    const pair: ObstaclePair = {
      id: nextIdRef.current++,
      x: dims.w + 40,
      gapY,
      gapSize,
      width: 70,
      scored: false,
    };
    obstaclesRef.current.push(pair);
  }, [dims.h, dims.w]);

  const collideRect = (ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) => {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  };

  const onCollision = useCallback(() => {
    console.log('Collision detected. Game over.');
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    }
    setTimeout(() => {
      endGame();
    }, 80);
  }, [endGame]);

  const gameStep = useCallback((dt: number) => {
    const h = dims.h;
    const w = dims.w;
    if (h <= 0 || w <= 0) return;

    // Difficulty progression
    speedRef.current = Math.min(340, speedRef.current + dt * 6);
    gapSizeRef.current = Math.max(150, gapSizeRef.current - dt * 4);
    spawnIntervalRef.current = Math.max(1100, spawnIntervalRef.current - dt * 10);

    // Spawn timer
    spawnTimerRef.current += dt * 1000;
    if (spawnTimerRef.current >= spawnIntervalRef.current) {
      spawnTimerRef.current = 0;
      spawnObstacle();
    }

    // Physics
    const gravity = 1400;
    velYRef.current += gravity * dt;
    toastYRef.current += velYRef.current * dt;

    // Bounds
    const ground = h - 20;
    const ceiling = 0;
    if (toastYRef.current + toastHeight > ground) {
      toastYRef.current = ground - toastHeight;
      velYRef.current = 0;
      onCollision();
    }
    if (toastYRef.current < ceiling) {
      toastYRef.current = ceiling;
      velYRef.current = 0;
    }

    // Update obstacles
    const speed = speedRef.current;
    obstaclesRef.current.forEach(ob => {
      ob.x -= speed * dt;
    });
    // Remove off-screen
    obstaclesRef.current = obstaclesRef.current.filter(ob => ob.x + ob.width > -40);

    // Scoring and collision with obstacles
    const ty = toastYRef.current;
    const tx = toastX;
    const tw = toastWidth;
    const th = toastHeight;

    for (const ob of obstaclesRef.current) {
      // score when passed
      if (!ob.scored && ob.x + ob.width < tx) {
        ob.scored = true;
        setScore(s => s + 1);
        if (Platform.OS !== 'web') {
          Haptics.selectionAsync().catch(() => {});
        }
      }
      // collision check
      const topRect = { x: ob.x, y: 0, w: ob.width, h: ob.gapY - ob.gapSize / 2 };
      const bottomRect = { x: ob.x, y: ob.gapY + ob.gapSize / 2, w: ob.width, h: h - (ob.gapY + ob.gapSize / 2) };
      const collided = collideRect(tx, ty, tw, th, topRect.x, topRect.y, topRect.w, topRect.h) ||
        collideRect(tx, ty, tw, th, bottomRect.x, bottomRect.y, bottomRect.w, bottomRect.h);
      if (collided) {
        onCollision();
        break;
      }
    }

    // trigger visual update for sprites
    setTick(t => (t + 1) % 1000);
  }, [dims.h, dims.w, onCollision, spawnObstacle]);

  const loop = useCallback((ts: number) => {
    if (!running) return;
    const last = lastTsRef.current;
    lastTsRef.current = ts;
    if (last != null) {
      const dt = Math.min(0.05, (ts - last) / 1000); // cap dt at 50ms
      gameStep(dt);
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [gameStep, running]);

  useEffect(() => {
    if (dims.w > 0 && dims.h > 0 && !running) {
      resetGame();
    }
  }, [dims, resetGame, running]);

  useEffect(() => {
    if (!running) return;
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [loop, running]);

  return (
    <View style={styles.container} onLayout={onLayout}>
      <HUD score={score} highScore={highScore ?? undefined} />
      <Pressable
        onPress={flap}
        style={{ display: 'contents' }}
      >
        {/* Game area */}
        <View style={[styles.playfield, { width: dims.w, height: dims.h }]}>
          {/* Floor line for visual finish */}
          <View style={[styles.ground, { top: dims.h - 12, width: dims.w }]} />
          {/* Toast */}
          <ToastSprite
            x={toastX}
            y={toastYRef.current}
            width={toastWidth}
            height={toastHeight}
          />
          {/* Obstacles */}
          {obstaclesRef.current.map(pair => {
            const topHeight = pair.gapY - pair.gapSize / 2;
            const bottomY = pair.gapY + pair.gapSize / 2;
            const bottomHeight = dims.h - bottomY;
            return (
              <View key={pair.id} pointerEvents="none">
                {/* Top Toaster */}
                <View style={[styles.obstacle, { left: pair.x, top: 0, width: pair.width, height: topHeight }]}>
                  <View style={styles.toasterSlot} />
                  <View style={[styles.toasterSlot, { top: '45%' }]} />
                </View>
                {/* Bottom Toaster */}
                <View style={[styles.obstacle, { left: pair.x, top: bottomY, width: pair.width, height: bottomHeight }]}>
                  <View style={styles.toasterSlot} />
                  <View style={[styles.toasterSlot, { top: '45%' }]} />
                </View>
              </View>
            );
          })}
          {/* Start hint */}
          {!running && (
            <View style={styles.centerHint} pointerEvents="none">
              <Text style={styles.hintText}>Tap to start</Text>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  playfield: {
    flex: 1,
    backgroundColor: colors.background,
  },
  ground: {
    position: 'absolute',
    height: 12,
    backgroundColor: '#E7D9B3',
  },
  obstacle: {
    position: 'absolute',
    backgroundColor: colors.obstacle,
    borderColor: colors.obstacleDark,
    borderWidth: 2,
    borderRadius: 8,
    boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
  },
  toasterSlot: {
    position: 'absolute',
    left: '15%',
    top: '15%',
    width: '70%',
    height: 10,
    backgroundColor: colors.obstacleDark,
    borderRadius: 4,
    opacity: 0.7,
  },
  centerHint: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 24,
    color: colors.text,
  },
});
