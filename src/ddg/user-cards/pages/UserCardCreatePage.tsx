import { useEffect, useMemo, useRef, useState } from "react";
import { MainLayout } from "../../components/Layout/MainLayout";
import { useUserCards } from "../hooks/useUserCards";
import { useUserCardCatalogs } from "../hooks/useUserCardCatalogs";
import type { IUserCardInfo } from "../../../admin/interfaces/user.interface";
import { UserCardPreview } from "../components/UserCardPreview";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import type { UserCard } from "../interfaces/user-card.interface";
import "./UserCards.css";

const CARD_STATUS_OPTIONS = [
  { label: "Activo", value: "ACTIVE" },
  { label: "Inactivo", value: "INACTIVE" },
];

export const UserCardCreatePage = () => {
  const toast = useRef<Toast>(null);

  const [users, setUsers] = useState<IUserCardInfo[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [cardStatus, setCardStatus] = useState<string>("ACTIVE");
  const [isActive, setIsActive] = useState(true);
  const [createdCard, setCreatedCard] = useState<UserCard | null>(null);

  const { loading: loadingCatalogs, loadUsers } = useUserCardCatalogs();
  const { loading: loadingCreate, error, createCard } = useUserCards();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const response = await loadUsers();
        setUsers(response);
      } catch {
        setUsers([]);
      }
    };

    void bootstrap();
  }, [loadUsers]);

  const userOptions = useMemo(
    () =>
      users.map((user) => ({
        label: `${user.user_nm} ${user.user_lt}`.trim(),
        value: user.user_id,
      })),
    [users],
  );

  const handleCreateCard = async () => {
    if (!selectedUserId) {
      toast.current?.show({
        severity: "warn",
        summary: "Dato requerido",
        detail: "Selecciona un usuario para crear su carnet.",
      });
      return;
    }

    try {
      const payload: any = {
        user_id: selectedUserId,
        card_status: cardStatus,
        is_active: isActive,
      };

      const result = await createCard(payload);
      setCreatedCard(result);
      toast.current?.show({
        severity: "success",
        summary: "Carnet creado",
        detail: "El carnet se creo correctamente.",
      });
    } catch {
      setCreatedCard(null);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No fue posible crear el carnet.",
      });
    }
  };

  const isLoading = loadingCatalogs || loadingCreate;
  const selectedUser = users.find((user) => user.user_id === selectedUserId);

  return (
    <MainLayout>
      <Toast ref={toast} position="top-right" baseZIndex={10000} />
      <section className="user-cards-page">
        <div className="user-cards-header">
          <h1 className="m-0">Crear Carnet</h1>
        </div>

        <Card className="user-cards-section mb-3">
          <div className="flex flex-column gap-3">
            <label htmlFor="create-card-user" className="font-medium">
              Usuario
            </label>
            <Dropdown
              inputId="create-card-user"
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

            <label htmlFor="create-card-status" className="font-medium">
              Estado del carnet
            </label>
            <Dropdown
              inputId="create-card-status"
              value={cardStatus}
              options={CARD_STATUS_OPTIONS}
              onChange={(event: DropdownChangeEvent) =>
                setCardStatus(String(event.value || "ACTIVE"))
              }
              className="w-full"
            />

            <div className="flex align-items-center gap-2">
              <Checkbox
                inputId="create-card-active"
                checked={isActive}
                onChange={(event) => setIsActive(Boolean(event.checked))}
              />
              <label htmlFor="create-card-active">Carnet activo</label>
            </div>

            <Button
              label="Crear carnet"
              icon="pi pi-plus"
              onClick={() => {
                void handleCreateCard();
              }}
              loading={isLoading}
            />
          </div>
        </Card>

        {isLoading ? (
          <Card className="user-cards-section text-center mb-3">
            <ProgressSpinner style={{ width: "40px", height: "40px" }} />
            <p className="mt-2 mb-0">Procesando solicitud...</p>
          </Card>
        ) : null}

        {error ? (
          <Card className="user-cards-section mb-3">
            <p className="m-0 p-error">{error}</p>
          </Card>
        ) : null}

        {createdCard ? (
          <Card className="user-cards-section" title="Carnet creado">
            <div className="flex flex-column gap-2">
              <UserCardPreview card={createdCard} user={selectedUser} />
            </div>
          </Card>
        ) : (
          !isLoading &&
          !error && (
            <Card className="user-cards-section">
              <p className="m-0 text-700">
                Completa el formulario para crear un carnet por usuario.
              </p>
            </Card>
          )
        )}
      </section>
    </MainLayout>
  );
};
