import { MainLayout } from "../../../ddg/components/Layout/MainLayout";

export const Messages = () => {
    return (
        <MainLayout>
            <div className="mb-4">
                <h1 className="m-0">Mensajes</h1>
            </div>
            <div className="surface-card p-4 shadow-2 border-round">
                <p>Bandeja de entrada de mensajes.</p>
            </div>
        </MainLayout>
    );
};
