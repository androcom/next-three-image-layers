'use client'

import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Box, Sphere } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'

// 문 컴포넌트
function Door() {
  // 1. 문이 열렸는지 상태를 관리합니다.
  const [isOpen, setIsOpen] = useState(false)

  // 2. react-spring의 useSpring 훅을 사용해 애니메이션 값을 설정합니다.
  // isOpen 상태가 true이면 Y축으로 90도(π/2) 회전, false이면 0도로 돌아옵니다.
  const { rotation } = useSpring({
    rotation: isOpen ? [0, Math.PI / 2, 0] : [0, 0, 0],
    config: { mass: 2, tension: 150, friction: 30 } // 물리 효과 설정 (통통 튀는 느낌)
  })

  return (
    // 3. 문의 경첩(회전축) 역할을 할 그룹입니다.
    // 애니메이션이 적용된 animated.group을 사용합니다.
    <animated.group rotation={rotation}>
      {/* 문짝 (Mesh) */}
      <Box
        args={[2, 4, 0.15]} // 문짝의 크기: [너비, 높이, 두께]
        position={[1, 2, 0]} // 4. 그룹(경첩)을 기준으로 문짝의 위치를 너비의 절반만큼 이동
        onClick={() => setIsOpen(!isOpen)} // 문을 클릭하면 상태를 토글합니다.
      >
        <meshStandardMaterial color="#663300" />
      </Box>

      {/* 문고리 */}
      <Sphere args={[0.15]} position={[1.8, 2, 0.2]}>
        <meshStandardMaterial color="gold" metalness={0.8} roughness={0.2} />
      </Sphere>
    </animated.group>
  )
}

// 메인 3D 씬 컴포넌트
export default function Scene() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'skyblue' }}>
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        {/* 바닥 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="lightgreen" />
        </mesh>

        {/* 문 프레임 */}
        <Box args={[2.2, 4.2, 0.3]} position={[1.1, 2.1, -0.1]}>
            <meshStandardMaterial color="saddlebrown" />
        </Box>

        {/* 문 컴포넌트 */}
        <Door />

        {/* 조명 및 환경 */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <Environment preset="sunset" />

        {/* 카메라 컨트롤 */}
        <OrbitControls />
      </Canvas>
    </div>
  )
}