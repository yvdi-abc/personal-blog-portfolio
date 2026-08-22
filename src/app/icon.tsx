import { ImageResponse } from 'next/og'

// 图片元数据
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// 图片生成
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '6px',
        }}
      >
        Y
      </div>
    ),
    {
      ...size,
    }
  )
}
