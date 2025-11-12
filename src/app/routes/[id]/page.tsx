import { RouteViewer } from "@/src/components/route-viewer";

export const metadata = {
    title: "Ver Ruta | RouteShare",
    description: "Visualiza una ruta turística compartida",
};

interface RoutePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function RoutePage({ params }: RoutePageProps) {
    const { id } = await params;
    return <RouteViewer routeId={id} />;
}
