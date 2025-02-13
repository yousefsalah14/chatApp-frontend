import { Link } from "react-router-dom"; // Assuming you're using react-router-dom
import { FaComment, FaCog } from "react-icons/fa"; // Using FontAwesome icons from react-icons
import { useAuthStore } from "../store/useAuthStore.js";
import { LogOut, User } from "lucide-react";

function Navbar() {
    const { logout, authUser } = useAuthStore();

    return (
        <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
            <div className="container mx-auto px-4 h-16">
                <div className="flex justify-between items-center h-full">
                    {/* left side */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FaComment className="w-5 h-5 text-primary" /> {/* Replaced MessageSquare with FaComment */}
                            </div>
                            <h1 className="text-lg font-bold">ChatTna</h1>
                        </Link>
                    </div>

                    {/* right side */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/settings"
                            className="btn btn-sm gap-2 transition-colors "
                        >
                            <FaCog className="w-5 h-5" /> {/* Replaced Settings with FaCog */}
                            <span className="hidden sm:inline">Settings</span>
                        </Link>
                        {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;