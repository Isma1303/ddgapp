import QRCode from "react-qr-code";
import type { IUserCardInfo } from "../../../admin/interfaces/user.interface";
import type { UserCard } from "../interfaces/user-card.interface";

interface UserCardPreviewProps {
  card: UserCard;
  user?: IUserCardInfo;
  className?: string;
}

const roleLabelMap: Record<string, string> = {
  LEADER: "Lider",
  USER: "Servidor",
  ADMIN: "Administrador",
};

const resolveField = (
  source: Record<string, unknown> | undefined,
  keys: string[],
): string | null => {
  if (!source) {
    return null;
  }

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
};

const resolveQrImage = (card: UserCard): string | null => {
  const imageCandidate =
    (card.qr_image_url as string | undefined) ||
    (card.qr_image as string | undefined) ||
    (card.qr_image_base64 as string | undefined);

  if (!imageCandidate) {
    return null;
  }

  if (
    imageCandidate.startsWith("data:image") ||
    imageCandidate.startsWith("http")
  ) {
    return imageCandidate;
  }

  return `data:image/png;base64,${imageCandidate}`;
};

const resolveUserName = (card: UserCard, user?: IUserCardInfo): string => {
  if (typeof card.full_name === "string" && card.full_name.trim()) {
    return card.full_name;
  }

  if (typeof card.user_nm === "string" && card.user_nm.trim()) {
    return card.user_nm;
  }

  if (user) {
    return `${user.user_nm} ${user.user_lt}`.trim();
  }

  return "Usuario sin nombre";
};

const resolveEmail = (card: UserCard, user?: IUserCardInfo): string => {
  const cardEmail = resolveField(card as Record<string, unknown>, ["email"]);
  if (cardEmail) {
    return cardEmail;
  }

  return user?.email?.trim() || "Sin correo";
};

const resolveDepartment = (card: UserCard, user?: IUserCardInfo): string => {
  const cardDepartment = resolveField(card as Record<string, unknown>, [
    "department_nm",
    "department_name",
    "department",
  ]);

  if (cardDepartment) {
    return cardDepartment;
  }

  return user?.department_nm?.trim() || "Sin departamento";
};

const resolveRole = (card: UserCard, user?: IUserCardInfo): string => {
  const roleCode = String(
    resolveField(card as Record<string, unknown>, ["role_cd", "role_code"]) ||
      user?.role_cd ||
      "",
  ).toUpperCase();

  if (roleCode && roleLabelMap[roleCode]) {
    return roleLabelMap[roleCode];
  }

  const roleName =
    resolveField(card as Record<string, unknown>, ["role_nm", "role_name"]) ||
    user?.role_nm;

  return roleName?.trim() || "Servidor";
};

const resolveQrValue = (card: UserCard): string => {
  if (typeof card.qr_value === "string" && card.qr_value.trim()) {
    return card.qr_value;
  }

  return "Sin valor QR";
};

export const UserCardPreview = ({
  card,
  user,
  className = "",
}: UserCardPreviewProps) => {
  const qrImage = resolveQrImage(card);
  const userName = resolveUserName(card, user);
  const department = resolveDepartment(card, user);
  const email = resolveEmail(card, user);
  const roleLabel = resolveRole(card, user);
  const qrValue = resolveQrValue(card);

  return (
    <article className={`user-card-preview ${className}`.trim()}>
      <header className="user-card-preview__header">
        <div className="user-card-preview__brand">Dias de Gloria</div>
      </header>

      <div className="user-card-preview__content">
        <div className="user-card-preview__photo" aria-hidden="true">
          <i className="pi pi-user" />
        </div>

        <div className="user-card-preview__info">
          <p className="user-card-preview__email" title={email}>
            {email}
          </p>
          <p className="user-card-preview__department" title={department}>
            {department}
          </p>
          <p className="user-card-preview__qr-value" title={qrValue}>
            {qrValue}
          </p>
        </div>
      </div>

      <div className="user-card-preview__footer">
        <div className="user-card-preview__identity">
          <h3 className="user-card-preview__name" title={userName}>
            {userName}
          </h3>
          <p className="user-card-preview__role">{roleLabel}</p>
        </div>

        <div className="user-card-preview__qr-box">
          {qrImage ? (
            <img
              src={qrImage}
              alt="QR del carnet"
              className="user-card-preview__qr-image"
            />
          ) : card.qr_value ? (
            <QRCode value={card.qr_value} size={78} />
          ) : (
            <span className="user-card-preview__qr-empty">Sin QR</span>
          )}
        </div>
      </div>
    </article>
  );
};
