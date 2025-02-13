import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js"
import { Camera, Mail, User } from "lucide-react";

function ProfilePage() {
    const {updateProfilePic ,isUpdatedingProfile , authUser}= useAuthStore()
    const [ selectedImg , setSelectedImg ] = useState(null);
    const [previewSrc, setPreviewSrc] = useState(null); // Store the preview URL

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        setSelectedImg(file); // Save the selected file
    
        // Preview image before upload
        const reader = new FileReader();
        reader.readAsDataURL(file);
        console.log(reader);
        
        reader.onload = () => setPreviewSrc(reader.result); // Show preview before uploading
    
        try {
            const response = await updateProfilePic(file); // Upload the image
            if (response?.data?.imageUrl) {
                setPreviewSrc(response.data.imageUrl); // Set the uploaded image URL from backend
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    }
    return (
        <div className="h-[105vh] pt-20">
            <div className="max-w-2xl mx-auto p-4 py-8">
                <div className="bg-base-300 rounded-xl p-6 space-y-8">
                <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>
          {/* upload image */}
          
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={ previewSrc || authUser.user.profilePic || "/avatar.png" }
                alt="Profile"
                className="size-40 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatedingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file" //  to upload 
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatedingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatedingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.user?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.user?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser?.user?.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
