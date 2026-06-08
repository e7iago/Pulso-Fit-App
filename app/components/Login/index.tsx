import React, { useState } from "react";
import axios from "axios";
import {
    Activity,
    ChevronRight,
    Lock,
    User,
    Loader2,
} from 'lucide-react';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const teste = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:8000/api/user", {
                withCredentials: true 
            });
            console.log(response);
            onLogin();
        } catch (err) {
            setError('Falha na autenticação. Tente novamente.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (email && password) {
            teste();
        } else {  
            setError('Por favor, preencha usuário e senha.');
        }
    };

    return (
        <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
            <Card className="w-full max-w-md border-0 shadow-xl">
                <CardHeader className="space-y-6 text-center pt-8">
                    <div className="flex justify-center mb-2">
                        <img src="/PulsoLogo.png" alt="Pulso Fit" className="h-20 w-20 object-contain" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-4xl font-extrabold tracking-wider">PULSO</CardTitle>
                        <CardDescription className="text-xl font-semibold text-foreground">FIT</CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                <User size={16} />
                                Usuário ou CPF
                            </label>
                            <Input
                                id="email"
                                type="text"
                                placeholder="Digite seu usuário ou CPF"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="h-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                                <Lock size={16} />
                                Senha
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Digite sua senha"
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
                                    Entrando...
                                </>
                            ) : (
                                <>
                                    Entrar
                                    <ChevronRight size={18} className="ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="pt-4 border-t text-center">
                        <p className="text-sm text-muted-foreground">
                            Esqueceu a senha?{' '}
                            <button className="text-primary hover:underline font-medium">
                                Recuperar acesso
                            </button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};