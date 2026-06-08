import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import Carregamento from "~/components/Carregamento";
import { Spinner } from "~/components/ui/spinner";
import { useSession } from "~/lib/auth-client";

export default function ProtectedLayout() {
    const { data: session, isPending } = useSession();
    const navigate = useNavigate();

    useEffect(() => {
        //O carregamento terminou e a sessão não está ativa
        if (!isPending && !session) {
            navigate("/login", { replace: true });
        }
    }, [session, isPending, navigate]);

    if (isPending) {
        return (
            <Carregamento className="size-10" />
        );
    }

    return <Outlet />;
}