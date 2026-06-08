import { Spinner } from "~/components/ui/spinner";

export default function Carregamento({...props}) {
    return (
        <div className="flex items-center justify-center h-full">
            <Spinner {...props} />
        </div>
    );
}