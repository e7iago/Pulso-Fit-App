import { useEffect, useState } from "react";
import { Form, useNavigate } from "react-router";
import { signIn, useSession } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";  
import { Activity, Loader2, LogIn } from "lucide-react";
import Feedback, { type FeedbackProps } from "~/components/Feedback";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<FeedbackProps>();
    const [isLoading, setIsLoading] = useState(false);

    const { data: session } = useSession();

    useEffect(() => {
        //Se já estiver logado, vai para home
        if (session) {
            navigate("/");
        }
    }, [session, navigate]);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError({});
        setIsLoading(true);

        if (email && password) {
            try {
                const result = await signIn.email({ 
                    email: email,
                    password: password,
                    callbackURL: "/"
                })
                if( result?.error?.message) setError({message: result.error.message});

                setIsLoading(false);
            } catch (err) {
                setError({message:"Erro ao fazer login. Verifique suas credenciais."});
                setIsLoading(false);
            }
        } else {
            setError({message:"Preencha todos os campos obrigatórios"});
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
                </CardHeader>

                <CardContent className="space-y-6">
                    <Feedback {...error} />

                    <Form onSubmit={handleSignIn} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">E-mail</label>
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
                            <label className="text-sm font-medium">Senha</label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Sua senha"
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
                                    <LogIn size={18} className="mr-2" />
                                    Entrar
                                </>
                            )}
                        </Button>
                    </Form>

                    <div className="pt-4 border-t text-center">
                        <p className="text-sm text-muted-foreground">
                            Não tem conta?{' '}
                            <button 
                                onClick={() => navigate("/signup")}
                                className="text-primary hover:underline font-medium"
                            >
                                Criar conta
                            </button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
