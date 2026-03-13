import { useEffect, useMemo, useRef, useState } from "react";
import { MainLayout } from "../../components/Layout/MainLayout";
import { useUserCards } from "../hooks/useUserCards";
import { useUserCardCatalogs } from "../hooks/useUserCardCatalogs";
import { useAuthStore } from "../../../system/shared/store/authStore";
import { getTokenUserId } from "../../../system/shared/services/token.service";
import type { UserCard } from "../interfaces/user-card.interface";
import { UserCardPreview } from "../components/UserCardPreview";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import type { IUserCardInfo } from "../../../admin/interfaces/user.interface";
import "./UserCards.css";

export const UserCardPage = () => {
  const token = useAuthStore((state) => state.token);
  const defaultUserId = useMemo(() => getTokenUserId(token), [token]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    defaultUserId,
  );
  const [users, setUsers] = useState<IUserCardInfo[]>([]);
  const [card, setCard] = useState<UserCard | null>(null);
  const [requested, setRequested] = useState(false);

  const toast = useRef<Toast>(null);
  const {
    loading: loadingCard,
    error,
    clearError,
    getCardByUserId,
  } = useUserCards();
  const { loading: loadingCatalogs, loadUsers } = useUserCardCatalogs();

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

  useEffect(() => {
    if (defaultUserId) {
      setSelectedUserId(defaultUserId);
    }
  }, [defaultUserId]);

  const userOptions = useMemo(
    () =>
      users.map((user) => ({
        label: `${user.user_nm} ${user.user_lt}`.trim(),
        value: user.user_id,
      })),
    [users],
  );

  const fetchCard = async () => {
    if (!selectedUserId) {
      toast.current?.show({
        severity: "warn",
        summary: "Dato requerido",
        detail: "Selecciona un usuario para consultar el carnet.",
      });
      return;
    }

    try {
      const response = await getCardByUserId(selectedUserId);
      setCard(response);
      setRequested(true);
      clearError();
    } catch {
      setCard(null);
      setRequested(true);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No fue posible consultar el carnet.",
      });
    }
  };

  const isLoading = loadingCard || loadingCatalogs;
  const selectedUser = users.find((user) => user.user_id === selectedUserId);

  return (
    <MainLayout>
      <Toast ref={toast} position="top-right" baseZIndex={10000} />
      <section className="user-cards-page">
        <div className="user-cards-header">
          <h1 className="m-0">Carnet con QR</h1>
        </div>

        <Card className="user-cards-section mb-3">
          <div className="flex flex-column gap-3">
            <label htmlFor="user-card-user-id" className="font-medium">
              Usuario
            </label>
            <Dropdown
              inputId="user-card-user-id"
              value={selectedUserId}
              options={userOptions}
              onChange={(event: DropdownChangeEvent) =>
                setSelectedUserId(Number(event.value) || null)
              }
              placeholder="Selecciona un usuario"
              filter
              showClear
              className="w-full"
            />

            <Button
              label="Consultar carnet"
              icon="pi pi-search"
              onClick={() => {
                void fetchCard();
              }}
              loading={isLoading}
            />
          </div>
        </Card>

        {isLoading ? (
          <Card className="user-cards-section text-center">
            <ProgressSpinner style={{ width: "40px", height: "40px" }} />
            <p className="mt-3 mb-0">Consultando carnet...</p>
          </Card>
        ) : null}

        {!isLoading && error ? (
          <Card className="user-cards-section">
            <p className="m-0 p-error">{error}</p>
          </Card>
        ) : null}

        {!isLoading && requested && !card && !error ? (
          <Card className="user-cards-section">
            <p className="m-0 text-700">
              No se encontro un carnet para ese usuario.
            </p>
          </Card>
        ) : null}

        {!isLoading && card ? (
          <Card className="user-cards-section">
            <UserCardPreview card={card} user={selectedUser} />
          </Card>
        ) : null}
      </section>
    </MainLayout>
  );
};
