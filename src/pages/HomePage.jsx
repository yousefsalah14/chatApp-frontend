import Chat from "../components/Chat.jsx"
import NoChatSelected from "../components/NoChatSelected.jsx"
import SideBar from "../components/SideBar.jsx"
import { useChatStore } from "../store/useChatStore.js"

function HomePage() {
    const {selectedUser} = useChatStore()
    return (
        <div className="h-screen bg-base-200">
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)] ">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <SideBar />
                        {!selectedUser ? <NoChatSelected />: <Chat />}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default HomePage
