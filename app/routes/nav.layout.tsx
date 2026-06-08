import { Outlet } from "react-router";

export const handle = { showNav: true };

export default function NavLayout() {
    return (
        <div className="pb-20">
            <Outlet />
        </div>
    );
}
