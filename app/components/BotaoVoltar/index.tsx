import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

export default function BotaoVoltar() {
    const navigate = useNavigate();

    const handleVoltar = () => {
        if (typeof window !== "undefined" && window.history.length > 2) {
            navigate(-1);
        } else {
            navigate("/");
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            type="button"
            className="gap-2 text-muted-foreground -ml-2"
            onClick={handleVoltar}>
            <ArrowLeft size={16} />
            Voltar
        </Button>
    )
}