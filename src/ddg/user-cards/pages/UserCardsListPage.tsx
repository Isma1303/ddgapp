import { useEffect, useMemo, useRef, useState } from "react";
import { MainLayout } from "../../components/Layout/MainLayout";
import { useUserCards } from "../hooks/useUserCards";
import { useUserCardCatalogs } from "../hooks/useUserCardCatalogs";
import type { UserCard } from "../interfaces/user-card.interface";
import type { IUserCardInfo } from "../../../admin/interfaces/user.interface";
import { UserCardPreview } from "../components/UserCardPreview";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import "./UserCards.css";

type PrintMode = "all" | "single" | null;

const resolveListUserName = (card: UserCard, user?: IUserCardInfo): string => {
  if (typeof card.full_name === "string" && card.full_name.trim()) {
    return card.full_name.trim();
  }

  if (typeof card.user_nm === "string" && card.user_nm.trim()) {
    return card.user_nm.trim();
  }

  if (user) {
    const fullName = `${user.user_nm} ${user.user_lt}`.trim();
    return fullName;
  }

  return "";
};

export const UserCardsListPage = () => {
  const toast = useRef<Toast>(null);

  const [cards, setCards] = useState<UserCard[]>([]);
  const [users, setUsers] = useState<IUserCardInfo[]>([]);
  const [printMode, setPrintMode] = useState<PrintMode>(null);
  const [printCardId, setPrintCardId] = useState<number | null>(null);

  const { loading: loadingCards, error, getAllCards } = useUserCards();
  const { loading: loadingCatalogs, loadUsers } = useUserCardCatalogs();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [allCards, allUsers] = await Promise.all([
          getAllCards(),
          loadUsers(),
        ]);
        setCards(allCards);
        setUsers(allUsers);
      } catch {
        setCards([]);
        setUsers([]);
      }
    };

    void bootstrap();
  }, [getAllCards, loadUsers]);

  const userMap = useMemo(
    () => new Map(users.map((user) => [user.user_id, user])),
    [users],
  );

  const visibleCards = useMemo(
    () =>
      cards.filter((card) => {
        const user = userMap.get(Number(card.user_id ?? 0));
        return Boolean(resolveListUserName(card, user));
      }),
    [cards, userMap],
  );

  useEffect(() => {
    const handleAfterPrint = () => {
      setPrintMode(null);
      setPrintCardId(null);
    };

    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  const triggerPrint = () => {
    setTimeout(() => {
      window.print();
    }, 60);
  };

  const handlePrintAll = () => {
    setPrintMode("all");
    setPrintCardId(null);
    triggerPrint();
  };

  const handlePrintOne = (cardId: number) => {
    setPrintMode("single");
    setPrintCardId(cardId);
    triggerPrint();
  };

  const isLoading = loadingCards || loadingCatalogs;

  return (
    <MainLayout>
      <Toast ref={toast} position="top-right" baseZIndex={10000} />
      <section className="user-cards-page user-cards-page--wide user-cards-list-print-container">
        <div className="user-cards-header user-cards-no-print">
          <h1 className="m-0">Listado de Carnets</h1>
          <Button
            type="button"
            icon="pi pi-print"
            label="Imprimir todos"
            onClick={handlePrintAll}
            disabled={visibleCards.length === 0}
          />
        </div>

        {isLoading ? (
          <Card className="user-cards-section text-center mb-3">
            <ProgressSpinner style={{ width: "40px", height: "40px" }} />
            <p className="mt-2 mb-0">Cargando carnets...</p>
          </Card>
        ) : null}

        {!isLoading && error ? (
          <Card className="user-cards-section mb-3 user-cards-no-print">
            <p className="m-0 p-error">{error}</p>
          </Card>
        ) : null}

        {!isLoading && !error && visibleCards.length === 0 ? (
          <Card className="user-cards-section user-cards-no-print">
            <p className="m-0 text-700">
              No hay carnets disponibles para mostrar.
            </p>
          </Card>
        ) : null}

        <div className="user-cards-grid">
          {visibleCards.map((card) => {
            const cardId = Number(card.user_card_id ?? card.user_id ?? 0);
            const isOnlyPrintCard =
              printMode === "single" &&
              printCardId !== null &&
              printCardId !== cardId;
            const user = userMap.get(Number(card.user_id ?? 0));

            return (
              <article
                key={`${String(card.user_card_id ?? "card")}-${String(card.user_id ?? "user")}`}
                className={`user-cards-mini user-cards-print-item ${isOnlyPrintCard ? "user-cards-print-hidden" : ""}`}
              >
                <UserCardPreview card={card} user={user} className="user-cards-mini__card" />

                <div className="user-cards-mini__actions user-cards-no-print">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      icon="pi pi-print"
                      label="Imprimir carnet"
                      className="p-button-secondary"
                      onClick={() => handlePrintOne(cardId)}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </MainLayout>
  );
};
