/**
 * AnimationCanvas.js
 * 全28種アニメーション対応。blue ball + gray box で空間ニュアンスを表現。
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, useWindowDimensions } from 'react-native';
import { colors } from '../constants/theme';

const CW = 320;
const CH = 160;
const BALL_D = 28;
const BALL_R = BALL_D / 2;
const FLOOR  = 128;
const BDX    = CW / 2 - BALL_R;   // 146
const BDY    = FLOOR - BALL_D;    // 100

function BoxRenderer({ type, scale }) {
  const base = { position: 'absolute', backgroundColor: '#555' };
  const sc = scale;

  switch (type) {
    case 'anim-jump-over':
    case 'anim-get-over':
    case 'anim-overcome':
      return <View style={[base, { left: sc(135), top: sc(116), width: sc(50), height: sc(12) }]} />;

    case 'anim-on':
    case 'anim-put-on':
    case 'anim-get-on':
      return <View style={[base, { left: sc(110), top: sc(118), width: sc(100), height: sc(10) }]} />;

    case 'anim-in':
    case 'anim-put-in':
    case 'anim-drop-in':
    case 'anim-go-in':
      return (
        <View style={{
          position: 'absolute', left: sc(128), top: sc(90), width: sc(64), height: sc(38),
          borderLeftWidth: sc(5), borderRightWidth: sc(5), borderBottomWidth: sc(5),
          borderColor: '#555', borderBottomLeftRadius: sc(8), borderBottomRightRadius: sc(8),
        }} />
      );

    case 'anim-at':
      return (
        <View>
          <View style={[base, { left: sc(232), top: sc(86), width: sc(3), height: sc(32) }]} />
          <View style={[base, { left: sc(222), top: sc(112), width: sc(16), height: sc(16),
            borderRadius: sc(8), backgroundColor: '#ff4444' }]} />
        </View>
      );

    case 'anim-arrive-at':
    case 'anim-get-to':
    case 'anim-reach':
    case 'anim-come-to':
      return (
        <View>
          <View style={[base, { left: sc(232), top: sc(76), width: sc(3), height: sc(52) }]} />
          <View style={[base, { left: sc(213), top: sc(76), width: sc(22), height: sc(14),
            backgroundColor: colors.accent }]} />
        </View>
      );

    case 'anim-run-away':
      return (
        <View style={[base, { left: sc(218), top: sc(100), width: sc(28), height: sc(28),
          borderRadius: sc(4), backgroundColor: '#8b0000' }]} />
      );

    case 'anim-look-up':
      return <View style={[base, { left: sc(218), top: sc(46), width: sc(16), height: sc(82) }]} />;

    case 'anim-through':
    case 'anim-go-through':
    case 'anim-pass-through':
    case 'anim-get-through':
      return (
        <View>
          <View style={[base, { left: sc(20), top: sc(88), width: sc(280), height: sc(10) }]} />
          <View style={[base, { left: sc(20), top: sc(118), width: sc(280), height: sc(10) }]} />
          <View style={[base, { left: sc(20), top: sc(88), width: sc(10), height: sc(40) }]} />
          <View style={[base, { left: sc(290), top: sc(88), width: sc(10), height: sc(40) }]} />
        </View>
      );

    case 'anim-between':
    case 'anim-stand-between':
      return (
        <View>
          <View style={[base, { left: sc(56), top: sc(66), width: sc(16), height: sc(62) }]} />
          <View style={[base, { left: sc(248), top: sc(66), width: sc(16), height: sc(62) }]} />
        </View>
      );

    case 'anim-fall-down':
      return (
        <View style={{
          position: 'absolute', left: sc(16), top: sc(44),
          width: 0, height: 0,
          borderBottomWidth: sc(84), borderRightWidth: sc(120),
          borderBottomColor: '#555', borderRightColor: 'transparent',
        }} />
      );

    case 'anim-hit':
    case 'anim-strike':
    case 'anim-crash-into':
      return <View style={[base, { left: sc(228), top: sc(46), width: sc(16), height: sc(82) }]} />;

    case 'anim-pass-over':
    case 'anim-fly-over':
      return <View style={[base, { left: sc(122), top: sc(100), width: sc(76), height: sc(28) }]} />;

    case 'anim-rely-on':
      return <View style={[base, { left: sc(222), top: sc(46), width: sc(16), height: sc(82) }]} />;

    case 'anim-aim-at':
    case 'anim-look-at':
    case 'anim-point-at':
      return (
        <View style={{
          position: 'absolute', left: sc(218), top: sc(80), width: sc(40), height: sc(40),
          borderWidth: sc(5), borderColor: '#ff4444', borderRadius: sc(20),
        }} />
      );

    case 'anim-choose-between':
    case 'anim-distinguish-between':
      return (
        <View>
          <View style={[base, { left: sc(52), top: sc(118), width: sc(40), height: sc(10) }]} />
          <View style={[base, { left: sc(228), top: sc(118), width: sc(40), height: sc(10) }]} />
        </View>
      );

    case 'anim-go-down':
      return (
        <View style={[base, {
          left: 0, top: sc(116), width: sc(CW), height: sc(20),
          backgroundColor: '#1a56db', opacity: 0.55,
        }]} />
      );

    case 'anim-sit-down':
      return (
        <View>
          <View style={[base, { left: sc(172), top: sc(116), width: sc(50), height: sc(12) }]} />
          <View style={[base, { left: sc(212), top: sc(86), width: sc(10), height: sc(42) }]} />
        </View>
      );

    case 'anim-bump-into':
      return (
        <View style={{
          position: 'absolute', left: sc(BDX + 72), top: sc(BDY),
          width: sc(BALL_D), height: sc(BALL_D), borderRadius: sc(BALL_R),
          backgroundColor: colors.success,
        }} />
      );

    case 'anim-step-on':
      return <View style={[base, { left: sc(118), top: sc(112), width: sc(84), height: sc(16) }]} />;

    case 'anim-walk-around':
    case 'anim-travel-around':
      return <View style={[base, { left: sc(44), top: sc(116), width: sc(232), height: sc(12) }]} />;

    case 'anim-go-up':
      return (
        <View>
          <View style={[base, { left: sc(72),  top: sc(118), width: sc(36), height: sc(10) }]} />
          <View style={[base, { left: sc(108), top: sc(108), width: sc(36), height: sc(10) }]} />
          <View style={[base, { left: sc(144), top: sc(98),  width: sc(36), height: sc(10) }]} />
          <View style={[base, { left: sc(180), top: sc(88),  width: sc(36), height: sc(10) }]} />
        </View>
      );

    default:
      return null;
  }
}

export default function AnimationCanvas({ animType }) {
  const { width: screenW } = useWindowDimensions();
  const ratio = screenW / CW;
  const scale = (v) => Math.round(v * ratio);

  const ballX   = useRef(new Animated.Value(0)).current;
  const ballY   = useRef(new Animated.Value(0)).current;
  const ballSX  = useRef(new Animated.Value(1)).current;
  const ballSY  = useRef(new Animated.Value(1)).current;
  const ballOp  = useRef(new Animated.Value(1)).current;
  const ballRot = useRef(new Animated.Value(0)).current;
  const loopRef = useRef(null);

  useEffect(() => {
    if (loopRef.current) loopRef.current.stop();
    ballX.setValue(0);  ballY.setValue(0);
    ballSX.setValue(1); ballSY.setValue(1);
    ballOp.setValue(1); ballRot.setValue(0);

    const anim = makeAnim();
    if (anim) { loopRef.current = anim; anim.start(); }
    return () => { if (loopRef.current) loopRef.current.stop(); };
  }, [animType, ratio]);

  function makeAnim() {
    const sc = scale;
    const mv = (val, to, dur, ease) =>
      Animated.timing(val, { toValue: to, duration: dur ?? 1000,
        easing: ease ?? Easing.inOut(Easing.ease), useNativeDriver: true });
    const snap = (val, to) =>
      Animated.timing(val, { toValue: to, duration: 0, useNativeDriver: true });
    const delay = Animated.delay;
    const par   = Animated.parallel;
    const seq   = Animated.sequence;
    const loop  = (f) => Animated.loop(seq(f));

    switch (animType) {
      case 'anim-jump-over':
      case 'anim-get-over':
      case 'anim-overcome':
        return loop([
          snap(ballX, sc(-112)), snap(ballY, 0),
          par([
            mv(ballX, sc(112), 2000, Easing.linear),
            seq([
              mv(ballY, sc(-80), 1000, Easing.out(Easing.sin)),
              mv(ballY, 0,       1000, Easing.in(Easing.sin)),
            ]),
          ]),
          delay(600),
        ]);

      case 'anim-in':
      case 'anim-put-in':
      case 'anim-drop-in':
      case 'anim-go-in':
        return loop([
          snap(ballY, sc(-88)),
          mv(ballY, sc(4), 1200, Easing.in(Easing.quad)),
          mv(ballSY, 0.85, 150),
          mv(ballSY, 1, 150),
          delay(1000),
          snap(ballY, sc(-88)),
          delay(300),
        ]);

      case 'anim-on':
      case 'anim-put-on':
      case 'anim-get-on':
        return loop([
          snap(ballY, sc(-88)),
          mv(ballY, sc(-16), 1200, Easing.bounce),
          delay(1200),
          snap(ballY, sc(-88)),
          delay(300),
        ]);

      case 'anim-at':
      case 'anim-arrive-at':
      case 'anim-get-to':
      case 'anim-reach':
      case 'anim-come-to':
        return loop([
          snap(ballX, sc(-120)),
          mv(ballX, sc(60), 1800, Easing.out(Easing.cubic)),
          delay(1200),
          snap(ballX, sc(-120)),
          delay(300),
        ]);

      case 'anim-run-away':
        return loop([
          snap(ballX, sc(62)),
          mv(ballX, sc(-140), 900, Easing.in(Easing.quad)),
          delay(800),
          snap(ballX, sc(62)),
          delay(300),
        ]);

      case 'anim-look-up':
        return loop([
          snap(ballX, sc(-60)),
          mv(ballSY, 1.25, 800, Easing.out(Easing.back(2))),
          delay(800),
          mv(ballSY, 1, 400),
          delay(800),
        ]);

      case 'anim-through':
      case 'anim-go-through':
      case 'anim-pass-through':
      case 'anim-get-through':
        return loop([
          snap(ballX, sc(-145)), snap(ballY, sc(-16)),
          mv(ballX, sc(145), 2000, Easing.linear),
          delay(400),
          snap(ballX, sc(-145)),
          delay(200),
        ]);

      case 'anim-between':
      case 'anim-stand-between':
        return loop([
          snap(ballX, sc(-124)),
          mv(ballX, sc(4), 1500, Easing.out(Easing.quad)),
          delay(1500),
          snap(ballX, sc(-124)),
          delay(300),
        ]);

      case 'anim-fall-down':
        return loop([
          snap(ballX, sc(-92)), snap(ballY, sc(-56)), snap(ballRot, 0),
          par([
            mv(ballX, sc(100), 2000, Easing.in(Easing.quad)),
            mv(ballY, 0,       2000, Easing.in(Easing.quad)),
            mv(ballRot, 2.2,   2000, Easing.linear),
          ]),
          mv(ballX, sc(160), 700, Easing.linear),
          delay(400),
        ]);

      case 'anim-hit':
      case 'anim-strike':
      case 'anim-crash-into':
        return loop([
          snap(ballX, sc(-114)),
          mv(ballX, sc(62), 700, Easing.in(Easing.quad)),
          par([mv(ballSX, 0.5, 150), mv(ballSY, 1.3, 150)]),
          par([mv(ballSX, 1, 150),   mv(ballSY, 1, 150)]),
          mv(ballX, sc(36), 350, Easing.out(Easing.quad)),
          delay(1000),
          snap(ballX, sc(-114)),
          delay(300),
        ]);

      case 'anim-pass-over':
      case 'anim-fly-over':
        return loop([
          snap(ballX, sc(-146)), snap(ballY, sc(-72)),
          mv(ballX, sc(146), 2200, Easing.linear),
          delay(400),
          snap(ballX, sc(-146)),
          delay(200),
        ]);

      case 'anim-look-around':
        return loop([
          snap(ballX, 0),
          mv(ballX, sc(-56), 800),
          mv(ballX, sc(56),  1600),
          mv(ballX, 0,       800),
          delay(500),
        ]);

      case 'anim-walk-around':
      case 'anim-travel-around':
        return loop([
          snap(ballX, sc(-82)),
          mv(ballX, sc(82),  2000),
          mv(ballX, sc(-82), 2000),
          delay(400),
        ]);

      case 'anim-turn-around':
        return loop([
          snap(ballSX, 1),
          mv(ballSX, 0, 300, Easing.in(Easing.ease)),
          mv(ballSX, 1, 300, Easing.out(Easing.ease)),
          delay(1200),
        ]);

      case 'anim-go-up':
        return loop([
          snap(ballX, sc(-94)), snap(ballY, 0),
          par([mv(ballX, sc(-64), 280), mv(ballY, sc(-10), 280)]),
          par([mv(ballX, sc(-34), 280), mv(ballY, sc(-20), 280)]),
          par([mv(ballX, sc(-4),  280), mv(ballY, sc(-30), 280)]),
          par([mv(ballX, sc(26),  280), mv(ballY, sc(-40), 280)]),
          delay(900),
          snap(ballX, sc(-94)), snap(ballY, 0),
          delay(200),
        ]);

      case 'anim-stand-up':
        return loop([
          snap(ballSX, 1.5), snap(ballSY, 0.3),
          mv(ballSY, 1.1, 500, Easing.out(Easing.back(2))),
          mv(ballSX, 0.9, 300),
          delay(1200),
          mv(ballSY, 0.3, 300, Easing.in(Easing.ease)),
          mv(ballSX, 1.5, 200),
          delay(400),
        ]);

      case 'anim-grow-up':
        return loop([
          snap(ballSX, 0.4), snap(ballSY, 0.4),
          par([
            mv(ballSX, 1.6, 2200, Easing.out(Easing.ease)),
            mv(ballSY, 1.6, 2200, Easing.out(Easing.ease)),
          ]),
          delay(800),
          snap(ballSX, 0.4), snap(ballSY, 0.4),
          delay(300),
        ]);

      case 'anim-walk-away':
      case 'anim-go-away':
      case 'anim-leave':
        return loop([
          snap(ballX, 0), snap(ballOp, 1), snap(ballSX, 1), snap(ballSY, 1),
          par([
            mv(ballX, sc(124), 2500, Easing.linear),
            mv(ballOp, 0, 2500, Easing.linear),
            mv(ballSX, 0.5, 2500),
            mv(ballSY, 0.5, 2500),
          ]),
          delay(500),
        ]);

      case 'anim-rely-on':
        return loop([
          snap(ballX, sc(-74)), snap(ballRot, 0),
          par([
            mv(ballX, sc(24), 1500, Easing.out(Easing.ease)),
            mv(ballRot, 0.04, 1500),
          ]),
          delay(1200),
          par([mv(ballX, sc(-74), 800), mv(ballRot, 0, 800)]),
          delay(300),
        ]);

      case 'anim-aim-at':
      case 'anim-look-at':
      case 'anim-point-at':
        return loop([
          snap(ballX, sc(-106)), snap(ballY, 0),
          par([
            mv(ballX, sc(62), 1600, Easing.out(Easing.quad)),
            mv(ballY, sc(-18), 1600, Easing.out(Easing.quad)),
          ]),
          delay(900),
          snap(ballX, sc(-106)), snap(ballY, 0),
          delay(300),
        ]);

      case 'anim-choose-between':
      case 'anim-distinguish-between':
        return loop([
          snap(ballX, 0),
          mv(ballX, sc(-88), 800),
          delay(600),
          mv(ballX, sc(88),  1200),
          delay(600),
          mv(ballX, sc(-88), 1200),
          delay(1200),
        ]);

      case 'anim-break-down':
        return loop([
          snap(ballSX, 1), snap(ballSY, 1),
          delay(800),
          par([
            mv(ballSX, 2.8, 300, Easing.out(Easing.ease)),
            mv(ballSY, 0.12, 300, Easing.out(Easing.ease)),
          ]),
          delay(700),
          snap(ballSX, 1), snap(ballSY, 1),
          delay(500),
        ]);

      case 'anim-sit-down':
        return loop([
          snap(ballX, sc(-82)), snap(ballSY, 1),
          mv(ballX, sc(22), 1000, Easing.out(Easing.ease)),
          mv(ballSY, 0.8, 200, Easing.out(Easing.ease)),
          delay(1200),
          par([mv(ballX, sc(-82), 600), mv(ballSY, 1, 300)]),
          delay(300),
        ]);

      case 'anim-bump-into':
        return loop([
          snap(ballX, sc(-94)),
          mv(ballX, sc(50), 800, Easing.in(Easing.ease)),
          par([mv(ballSX, 0.5, 150), mv(ballSY, 1.3, 150)]),
          par([mv(ballSX, 1, 150),   mv(ballSY, 1, 150)]),
          mv(ballX, sc(20), 400, Easing.out(Easing.ease)),
          delay(1000),
          snap(ballX, sc(-94)),
          delay(300),
        ]);

      case 'anim-step-on':
        return loop([
          snap(ballY, sc(-70)), snap(ballSX, 1), snap(ballSY, 1),
          mv(ballY, sc(-16), 1000, Easing.in(Easing.quad)),
          par([mv(ballSX, 1.4, 200), mv(ballSY, 0.6, 200)]),
          par([mv(ballSX, 1, 200),   mv(ballSY, 1, 200)]),
          delay(900),
          snap(ballY, sc(-70)),
          delay(300),
        ]);

      case 'anim-go-down':
        return loop([
          snap(ballY, sc(-44)), snap(ballOp, 1),
          par([
            mv(ballY, sc(32), 2200, Easing.in(Easing.ease)),
            mv(ballOp, 0, 2200, Easing.linear),
          ]),
          delay(400),
          snap(ballOp, 0), snap(ballY, sc(-44)),
          mv(ballOp, 1, 300),
          delay(300),
        ]);

      default:
        return loop([
          mv(ballY, sc(-14), 800, Easing.inOut(Easing.ease)),
          mv(ballY, 0,       800, Easing.inOut(Easing.ease)),
        ]);
    }
  }

  const rotInterp = ballRot.interpolate({
    inputRange: [0, 1], outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ width: screenW, height: scale(CH), backgroundColor: '#000', overflow: 'hidden' }}>
      <BoxRenderer type={animType} scale={scale} />
      <Animated.View
        style={{
          position: 'absolute',
          width: scale(BALL_D), height: scale(BALL_D),
          borderRadius: scale(BALL_R),
          backgroundColor: colors.accent,
          left: scale(BDX), top: scale(BDY),
          transform: [
            { translateX: ballX },
            { translateY: ballY },
            { scaleX: ballSX },
            { scaleY: ballSY },
            { rotate: rotInterp },
          ],
          opacity: ballOp,
        }}
      />
    </View>
  );
}
