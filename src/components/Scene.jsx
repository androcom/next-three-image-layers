'use client'

import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Box, Sphere } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import { Geometry, Base, Subtraction } from '@react-three/csg'

// 1. 문 프레임 컴포넌트 (가운데가 비어있음)
function DoorFrame({ doorWidth, doorHeight, frameThickness, frameDepth }) {
  return (
    <mesh position={[doorWidth / 2, doorHeight / 2, 0]}>
      <Geometry>
        {/* Base: 전체 프레임의 외부 형태 */}
        <Base>
          <boxGeometry args={[
            doorWidth + frameThickness * 2,
            doorHeight + frameThickness,
            frameDepth
          ]} />
        </Base>
        {/* Subtraction: 문이 들어갈 내부 공간 (빼낼 부분) */}
        <Subtraction position={[0, -frameThickness / 2, 0]}>
          <boxGeometry args={[
            doorWidth,
            doorHeight,
            frameDepth * 2
          ]} />
        </Subtraction>
      </Geometry>
      <meshStandardMaterial color="saddlebrown" />
    </mesh>
  )
}

// 2. 문 컴포넌트 (다시 속이 꽉 찬 형태로 복원)
function Door({ doorWidth, doorHeight, doorThickness }) {
  const [isOpen, setIsOpen] = useState(false)
  const { rotation } = useSpring({
    rotation: isOpen ? [0, Math.PI / 2, 0] : [0, 0, 0],
    config: { mass: 2, tension: 150, friction: 30 }
  })

  return (
    <animated.group rotation={rotation}>
      {/* 문짝 (Solid Box) */}
      <Box
        args={[doorWidth, doorHeight, doorThickness]}
        position={[doorWidth / 2, doorHeight / 2, 0]}
        onClick={() => setIsOpen(!isOpen)}
      >
        <meshStandardMaterial color="#663300" />
      </Box>

      {/* 문고리 */}
      <Sphere
        args={[0.15]}
        position={[doorWidth - 0.2, doorHeight / 2, doorThickness]}
      >
        <meshStandardMaterial color="gold" metalness={0.8} roughness={0.2} />
      </Sphere>
    </animated.group>
  )
}

// 메인 3D 씬 컴포넌트
export default function Scene() {
  // 문과 프레임의 크기를 변수로 관리하여 일관성 유지
  const doorConfig = {
    doorWidth: 2,
    doorHeight: 4,
    doorThickness: 0.1,
    frameThickness: 0.2, // 프레임 두께
    frameDepth: 0.15,    // 프레임 깊이
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'skyblue' }}>
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        {/* 바닥 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="lightgreen" />
        </mesh>

        {/* 3. 새로운 DoorFrame과 Door 컴포넌트 렌더링 */}
        <DoorFrame {...doorConfig} />
        <Door {...doorConfig} />

        {/* 조명 및 환경 */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <Environment preset="sunset" />

        {/* 카메라 컨트롤 */}
        <OrbitControls />
      </Canvas>
    </div>
  )
}