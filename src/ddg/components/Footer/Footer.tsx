export const Footer = () => {
    const getFullYear = new Date().getFullYear();
    return (

        <footer className="surface-section p-3 border-top-1 surface-border text-center">
            <p className="m-0 text-color-secondary ">© {getFullYear} DDG App. All rights reserved.</p>
        </footer>
    )
}