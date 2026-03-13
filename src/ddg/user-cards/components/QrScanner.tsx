import { useEffect, useMemo, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

interface QrScannerProps {
  onScanSuccess: (qrValue: string) => void;
  disabled?: boolean;
}

export const QrScanner = ({
  onScanSuccess,
  disabled = false,
}: QrScannerProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isDecodingImage, setIsDecodingImage] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const scannerElementId = useMemo(
    () => `qr-scanner-${Math.random().toString(36).slice(2, 10)}`,
    [],
  );

  const stopScanner = async () => {
    if (!scannerRef.current) {
      return;
    }

    try {
      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }
      await scannerRef.current.clear();
    } finally {
      scannerRef.current = null;
      setIsScanning(false);
      setIsStarting(false);
    }
  };

  const startScanner = async () => {
    if (disabled || isScanning || isStarting) {
      return;
    }

    try {
      setScannerError(null);
      setIsStarting(true);

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerElementId);
      }

      const scannerConfig = {
        fps: 10,
        qrbox: { width: 240, height: 240 },
        aspectRatio: 1,
      };

      const onDecode = (decodedText: string) => {
        onScanSuccess(decodedText);
      };

      const onDecodeError = () => {};

      const cameras = await Html5Qrcode.getCameras();
      const rearCamera = cameras.find((camera) =>
        /back|rear|trase|environment/i.test(camera.label),
      );

      if (rearCamera?.id) {
        await scannerRef.current.start(
          rearCamera.id,
          scannerConfig,
          onDecode,
          onDecodeError,
        );
      } else {
        await scannerRef.current.start(
          { facingMode: { ideal: "environment" } },
          scannerConfig,
          onDecode,
          onDecodeError,
        );
      }

      setIsScanning(true);
    } catch (error: any) {
      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const insecureContext = !window.isSecureContext && !isLocalhost;

      setScannerError(
        insecureContext
          ? "El navegador bloqueo la camara en conexion insegura. Usa 'Leer desde imagen' o abre la app en localhost/HTTPS."
          : error?.message ||
              "No fue posible iniciar la camara. Verifica permisos del navegador.",
      );
      await stopScanner();
    } finally {
      setIsStarting(false);
    }
  };

  const handleOpenImagePicker = () => {
    if (disabled || isStarting || isScanning || isDecodingImage) {
      return;
    }
    imageInputRef.current?.click();
  };

  const handleImageSelection = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setScannerError(null);
      setIsDecodingImage(true);

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerElementId);
      }

      const decodedText = await scannerRef.current.scanFile(file, true);
      onScanSuccess(decodedText);
    } catch (error: any) {
      setScannerError(
        error?.message || "No se pudo leer un QR desde la imagen seleccionada.",
      );
    } finally {
      setIsDecodingImage(false);
      event.target.value = "";
    }
  };

  useEffect(() => {
    return () => {
      void stopScanner();
    };
  }, []);

  return (
    <div className="user-cards-scanner-wrapper">
      <div id={scannerElementId} className="user-cards-scanner-view" />

      <div className="flex gap-2 mt-3 flex-wrap">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={(event) => {
            void handleImageSelection(event);
          }}
        />

        <Button
          type="button"
          icon="pi pi-camera"
          label={isStarting ? "Iniciando..." : "Iniciar escaneo"}
          onClick={() => {
            void startScanner();
          }}
          disabled={disabled || isStarting || isScanning}
          className="p-button-primary"
        />

        <Button
          type="button"
          icon="pi pi-image"
          label={isDecodingImage ? "Leyendo imagen..." : "Leer desde imagen"}
          onClick={handleOpenImagePicker}
          disabled={disabled || isStarting || isScanning || isDecodingImage}
          className="p-button-help"
        />

        <Button
          type="button"
          icon="pi pi-stop"
          label="Detener"
          onClick={() => {
            void stopScanner();
          }}
          disabled={!isScanning && !isStarting}
          className="p-button-secondary"
        />

        <Tag
          value={isScanning ? "Camara activa" : "Camara inactiva"}
          severity={isScanning ? "success" : "warning"}
        />
      </div>

      {scannerError ? (
        <small className="p-error mt-2 block">{scannerError}</small>
      ) : null}
    </div>
  );
};
