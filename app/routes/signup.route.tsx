import { useEffect, useState } from "react";
import { Form, useNavigate } from "react-router";
import { signUp, useSession } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Activity, Loader2, UserPlus } from "lucide-react";

export default function SignUp() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { data: session } = useSession();

    useEffect(() => {
        if (session) navigate("/");
    }, [session, navigate]);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (email && password && name) {
            try {
                await signUp.email({
                    email: email,
                    name: name,
                    password: password,
                    callbackURL: "/"
                })
            } catch (err) {
                setError("Erro ao criar conta. Tente novamente.");
                setIsLoading(false);
            }
        } else {
            setError("Preencha todos os campos obrigatórios");
            setIsLoading(false);
        }
    }

    return (
        <div className="h-full flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-0 shadow-xl">
                <CardHeader className="space-y-6 text-center pt-8">
                    <div className="flex justify-center mb-2">
                        <img src="/PulsoLogo.png" alt="Pulso Fit" className="h-20 w-20 object-contain" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-4xl font-extrabold tracking-wider">PULSO</CardTitle>
                        <CardDescription className="text-xl font-semibold text-foreground">FIT</CardDescription>
                    </div>
                    <p className="text-sm text-muted-foreground">Crie sua conta para começar</p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Nome Completo</label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Seu nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                                className="h-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">E-mail</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="h-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">Senha</label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Crie uma senha forte"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="h-10"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            size="lg"
                            className="w-full mt-6 font-semibold"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Criando conta...
                                </>
                            ) : (
                                <>
                                    <UserPlus size={18} className="mr-2" />
                                    Criar Conta
                                </>
                            )}
                        </Button>
                    </Form>

                    <div className="pt-4 border-t text-center">
                        <p className="text-sm text-muted-foreground">
                            Já tem conta?{' '}
                            <button 
                                onClick={() => navigate("/login")}
                                className="text-primary hover:underline font-medium"
                            >
                                Entrar
                            </button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}