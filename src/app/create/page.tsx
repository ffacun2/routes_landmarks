import { RouteCreator } from "@/src/components/route-creator";

export const metadata = {
	title: "Crear Ruta | RouteShare",
	description: "Crea una nueva ruta turística con landmarks personalizados",
};

export default function CreatePage() {
	return <RouteCreator />;
}
