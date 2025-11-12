import { RoutesList } from "@/src/components/routes-list";

export const metadata = {
	title: "Rutas Públicas | RouteShare",
	description: "Explora rutas turísticas creadas por la comunidad",
};

export default function RoutesPage() {
	return <RoutesList />;
}
