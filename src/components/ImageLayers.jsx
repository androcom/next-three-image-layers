'use client'

import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { TextureLoader, DoubleSide } from 'three'

// 하나의 이미지를 앞/뒷면에만 적용하는 박스 컴포넌트
const ImageBox = ({ imageUrl, position, size = [2, 2.5, 0.2] }) => {
  // 단일 텍스처 로드
  const texture = useLoader(TextureLoader, imageUrl)

  // 1. 이미지 재질과 기본 재질을 별도로 생성
  const imageMaterial = <meshStandardMaterial map={texture} side={DoubleSide} />
  const defaultMaterial = <meshStandardMaterial color="#333" /> // 옆면/윗면/아랫면에 쓸 재질

  // 2. 6개 면에 대한 재질 배열을 직접 구성
  // 순서: [오른쪽, 왼쪽, 위, 아래, 앞, 뒤]
  const materials = [
    defaultMaterial, // 오른쪽 (-X)
    defaultMaterial, // 왼쪽 (+X)
    defaultMaterial, // 위 (+Y)
    defaultMaterial, // 아래 (-Y)
    imageMaterial,   // 앞 (+Z)
    imageMaterial,   // 뒤 (-Z)
  ]

  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      {/* 3. 구성된 재질 배열을 자식으로 전달 */}
      {materials}
    </mesh>
  )
}

export default function ImageLayers() {
  // 3개의 박스에 사용할 이미지 URL 배열
  const imageUrls = [
    '/image1.png',
    '/image2.png',
    '/image3.png',
  ]

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [-2.5, -5, -5], fov: 80 }}>
        <ambientLight intensity={0.8} />
        <Environment preset="city" />

        {imageUrls.map((url, index) => (
          <ImageBox
            key={index}
            imageUrl={url}
            // 박스들을 Z축을 따라 나란히 배치
            position={[0, 0, (index - 1) * 3]}
          />
        ))}

        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  )
}