import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CameraIcon, Volume2, VolumeX } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface QRCodeScannerProps {
  onScan: (data: string) => void;
}

const QRCodeScanner = ({ onScan }: QRCodeScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const { toast } = useToast();
  const scannerRef = useRef<any>(null);
  const isMountedRef = useRef(true);
  const scannerContainerId = "qr-reader";

  // Store feedback settings in localStorage
  useEffect(() => {
    const storedSoundEnabled = localStorage.getItem("soundEnabled");
    const storedVibrationEnabled = localStorage.getItem("vibrationEnabled");
    if (storedSoundEnabled !== null) setSoundEnabled(storedSoundEnabled === "true");
    if (storedVibrationEnabled !== null) setVibrationEnabled(storedVibrationEnabled === "true");
  }, []);

  // Save feedback settings when they change
  useEffect(() => {
    localStorage.setItem("soundEnabled", String(soundEnabled));
    localStorage.setItem("vibrationEnabled", String(vibrationEnabled));
    window.vibrationEnabled = vibrationEnabled;
    window.soundEnabled = soundEnabled;
  }, [soundEnabled, vibrationEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopScanner();
    };
    // eslint-disable-next-line
  }, []);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
        scannerRef.current = null;
      } catch (err) {
        console.warn("Error stopping scanner:", err);
      }
    }
    setScanning(false);
  };

  const startScanner = async () => {
    setCameraError(null);
    try {
      await stopScanner();
      if (!isMountedRef.current) return;

      const { Html5Qrcode } = await import("html5-qrcode");
      if (!isMountedRef.current) return;
      const html5QrCode = new Html5Qrcode(scannerContainerId);
      scannerRef.current = html5QrCode;

      const qrCodeSuccessCallback = (decodedText: string) => {
        if (!isMountedRef.current) return;
        onScan(decodedText);
        stopScanner().then(() => {
          if (isMountedRef.current) {
            toast({
              title: "QR Code Escaneado",
              description: "O QR Code foi escaneado com sucesso!",
            });
          }
        });
      };

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      // ⚡️Tenta com "environment" (celular) e "user" (webcam notebook) automaticamente
      let cameraStarted = false;
      let errorMsg = "";

      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          qrCodeSuccessCallback,
          (errorMessage: string) => {
            if (isMountedRef.current && errorMessage.toLowerCase().includes("notfounderror")) {
              setCameraError(
                "Não foi possível encontrar uma câmera. Por favor, conecte uma câmera ou libere a permissão."
              );
              setScanning(false);
            }
            if (
              isMountedRef.current &&
              (errorMessage.includes("getUserMedia") ||
                errorMessage.toLowerCase().includes("notallowederror") ||
                errorMessage.toLowerCase().includes("notreadableerror"))
            ) {
              setCameraError(
                "Permissão negada ou câmera ocupada. Feche outros aplicativos que estejam usando a câmera e tente novamente."
              );
              setScanning(false);
            }
            errorMsg = errorMessage;
          }
        );
        cameraStarted = true;
      } catch (err) {
        // Se falhar com "environment", tenta "user"
        try {
          await html5QrCode.start(
            { facingMode: "user" },
            config,
            qrCodeSuccessCallback,
            (errorMessage: string) => {
              errorMsg = errorMessage;
              setCameraError(
                "Não foi possível acessar a câmera. Certifique-se de que ela está conectada e que a permissão foi concedida."
              );
              setScanning(false);
            }
          );
          cameraStarted = true;
        } catch (err2) {
          console.error("Erro ao acessar a câmera:", err, err2);
          setCameraError(
            "Erro ao iniciar o scanner. Verifique as permissões da câmera ou tente reiniciar o navegador. " +
              (errorMsg || "")
          );
          setScanning(false);
        }
      }

      if (cameraStarted && isMountedRef.current) setScanning(true);
    } catch (error: any) {
      setCameraError(
        "Erro ao iniciar o scanner. Por favor, tente novamente. " +
          (error?.message || "")
      );
      setScanning(false);
      console.error("Error starting QR scanner:", error);
      toast({
        title: "Erro ao acessar a câmera",
        description: error?.message || String(error),
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Scanner de QR Code</CardTitle>
        <CardDescription className="text-center">
          Use a câmera para escanear o QR Code do ingresso
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div
          id={scannerContainerId}
          className="w-full max-w-xs aspect-square bg-muted flex items-center justify-center rounded-md overflow-hidden relative"
          style={{ minHeight: 250 }}
        >
          {(!scanning && !cameraError) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-muted z-10">
              <CameraIcon className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Clique no botão abaixo para iniciar o scanner
              </p>
            </div>
          )}
          {cameraError && (
            <div className="absolute inset-0 p-4 flex items-center justify-center text-center text-destructive text-sm bg-muted z-10">
              {cameraError}
            </div>
          )}
        </div>

        <div className="w-full max-w-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <Label htmlFor="sound-toggle">Som</Label>
            </div>
            <Switch
              id="sound-toggle"
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="vibration-toggle">Vibração</Label>
            <Switch
              id="vibration-toggle"
              checked={vibrationEnabled}
              onCheckedChange={setVibrationEnabled}
            />
          </div>
        </div>

        <div className="flex gap-2 w-full max-w-xs">
          <Button
            onClick={startScanner}
            disabled={scanning}
            variant={scanning ? "outline" : "default"}
            className="flex-1"
          >
            {scanning ? "Escaneando..." : "Iniciar Scanner"}
          </Button>

          {scanning && (
            <Button onClick={stopScanner} variant="outline" className="flex-1">
              Parar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Add a global declaration to make feedback settings available
declare global {
  interface Window {
    vibrationEnabled?: boolean;
    soundEnabled?: boolean;
  }
}

export default QRCodeScanner;
