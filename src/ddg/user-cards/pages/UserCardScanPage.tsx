import { useRef, useState } from "react";
import { MainLayout } from "../../components/Layout/MainLayout";
import { QrScanner } from "../components/QrScanner";
import { useUserCards } from "../hooks/useUserCards";
import { useUserCardCatalogs } from "../hooks/useUserCardCatalogs";
import type { ScanQrResponse } from "../interfaces/user-card.interface";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { useEffect, useMemo } from "react";
import type { IUserCardInfo } from "../../../admin/interfaces/user.interface";
import { UserCardPreview } from "../components/UserCardPreview";
import "./UserCards.css";

export const UserCardScanPage = () => {
  const toast = useRef<Toast>(null);
  const lastReadRef = useRef<string>("");
  const [lastQrValue, setLastQrValue] = useState<string>("");
  const [result, setResult] = useState<ScanQrResponse | null>(null);
  const [users, setUsers] = useState<IUserCardInfo[]>([]);
  const { loading, error, scanQr } = useUserCards();
  const { loadUsers } = useUserCardCatalogs();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const usersResponse = await loadUsers();
        setUsers(usersResponse);
      } catch {
        setUsers([]);
      }
    };

    void bootstrap();
  }, [loadUsers]);

  const scannedCard = result?.user_card;
  const scannedUser = useMemo(() => {
    const scannedUserId = Number(scannedCard?.user_id);
    if (!scannedUserId) {
      return undefined;
    }

    return users.find((user) => user.user_id === scannedUserId);
  }, [scannedCard?.user_id, users]);

  const handleScanSuccess = async (qrValue: string) => {
    const normalized = qrValue.trim();

    if (!normalized || lastReadRef.current === normalized) {
      return;
    }

    lastReadRef.current = normalized;
    setLastQrValue(normalized);

    try {
      const response = await scanQr({ qr_value: normalized });
      setResult(response);
      toast.current?.show({
        severity: "success",
        summary: "QR detectado",
        detail: "Se valido el QR correctamente.",
      });
    } catch {
      setResult(null);
      toast.current?.show({
        severity: "error",
        summary: "QR invalido",
        detail: "No fue posible validar el codigo escaneado.",
      });
      setTimeout(() => {
        lastReadRef.current = "";
      }, 1000);
    }
  };

  return (
    <MainLayout>
      <Toast ref={toast} position="top-right" baseZIndex={10000} />
      <section className="user-cards-page">
        <div className="user-cards-header">
          <h1 className="m-0">Escaneo de QR</h1>
        </div>

        <Card className="user-cards-section mb-3">
          <p className="mt-0 text-700">
            Usa la camara del telefono para escanear el QR del carnet.
          </p>
          <QrScanner
            onScanSuccess={(value) => void handleScanSuccess(value)}
            disabled={loading}
          />
        </Card>

        {loading ? (
          <Card className="user-cards-section text-center mb-3">
            <ProgressSpinner style={{ width: "40px", height: "40px" }} />
            <p className="mt-2 mb-0">Validando QR...</p>
          </Card>
        ) : null}

        {lastQrValue ? (
          <Card className="user-cards-section mb-3" title="Ultima lectura">
            <p className="m-0 break-all">{lastQrValue}</p>
          </Card>
        ) : null}

        {error ? (
          <Card className="user-cards-section mb-3">
            <p className="m-0 p-error">{error}</p>
          </Card>
        ) : null}

        {result ? (
          <Card className="user-cards-section" title="Resultado de validacion">
            <div className="flex flex-column gap-3">
              <Tag
                value={
                  result.message || (result.success ? "Valido" : "Sin mensaje")
                }
                severity={result.success === false ? "danger" : "success"}
              />

              {scannedCard ? (
                <UserCardPreview card={scannedCard} user={scannedUser} />
              ) : (
                <p className="m-0 text-700">
                  El backend no devolvio los datos del carnet en esta lectura.
                </p>
              )}
            </div>
          </Card>
        ) : (
          !loading &&
          !error && (
            <Card className="user-cards-section">
              <p className="m-0 text-700">
                Aun no hay resultados. Inicia el escaneo para validar un QR.
              </p>
            </Card>
          )
        )}
      </section>
    </MainLayout>
  );
};
