
import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  alt?: string;
  logoUrl?: string;
  displayBorder?: boolean;
  colorDark?: string;
  colorLight?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

const QRCodeDisplay = ({ 
  value, 
  size = 200, 
  alt = "QR Code",
  logoUrl,
  displayBorder = false,
  colorDark = "#006437", // Verde Palmeiras
  colorLight = "#FFFFFF", // Branco
  errorCorrectionLevel = 'M'
}: QRCodeDisplayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(
        canvasRef.current,
        value,
        {
          width: size,
          margin: 2,
          errorCorrectionLevel,
          color: {
            dark: colorDark, 
            light: colorLight,
          },
        },
        (error) => {
          if (error) console.error("Error generating QR code:", error);
        }
      );
    }
  }, [value, size, colorDark, colorLight, errorCorrectionLevel]);

  return (
    <div className={`qr-code-container ${displayBorder ? 'border-2 border-dashed border-gray-300 p-2 rounded-md' : ''}`}>
      <canvas ref={canvasRef} aria-label={alt} role="img" className="mx-auto" />
      <p className="sr-only">{alt}: {value}</p>
    </div>
  );
};

export default QRCodeDisplay;
