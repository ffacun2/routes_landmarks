import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Checkbox } from "@/src/components/ui/checkbox";

export default function RegisterPage() {
	return (
		<div className="min-h-screen bg-background flex flex-col">
			{/* Register Form */}
			<div className="flex-1 flex items-center justify-center px-4 py-12">
				<Card className="w-full max-w-lg p-8">
					<div className="text-center mb-8">
						<h2 className="text-3xl font-bold text-foreground mb-2">
							Crear Cuenta
						</h2>
						<p className="text-muted-foreground">
							Únete gratis y empieza a crear rutas increíbles
						</p>
					</div>

					<form className="space-y-5">
						<div className="space-y-2">
							<Label htmlFor="name">Nombre Completo</Label>
							<Input
								id="name"
								type="text"
								placeholder="Juan Pérez"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Correo Electrónico</Label>
							<Input
								id="email"
								type="email"
								placeholder="tu@email.com"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Contraseña</Label>
							<Input
								id="password"
								type="password"
								placeholder="Mínimo 8 caracteres"
								required
								minLength={8}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirm-password">
								Confirmar Contraseña
							</Label>
							<Input
								id="confirm-password"
								type="password"
								placeholder="Repite tu contraseña"
								required
								minLength={8}
							/>
						</div>

						<div className="flex items-start gap-2">
							<Checkbox id="terms" required />
							<div className=""> 
								<Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
									Acepto los{" "}
									<Link href="/terms" className="text-primary hover:underline">
										términos y condiciones
									</Link>{" "}
									y la{" "}
									<Link href="/privacy" className="text-primary hover:underline">
										política de privacidad
									</Link>
								</Label>
							</div>
						</div>

						<Button type="submit" className="w-full" size="lg">
							Crear Cuenta
						</Button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-sm text-muted-foreground">
							¿Ya tienes una cuenta?{" "}
							<Link
								href="/login"
								className="text-primary font-medium hover:underline"
							>
								Iniciar sesión
							</Link>
						</p>
					</div>
				</Card>
			</div>
		</div>
	);
}
