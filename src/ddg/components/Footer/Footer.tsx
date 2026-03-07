export const Footer = () => {
  const getFullYear = new Date().getFullYear();
  return (
    <footer
      className="surface-section p-3 border-top-1 surface-border text-center"
      style={{ background: "rgba(255, 255, 255, 0.75)" }}
    >
      <p className="m-0 text-color-secondary">
        © {getFullYear} DDG App. Todos los derechos reservados.
      </p>
    </footer>
  );
};
