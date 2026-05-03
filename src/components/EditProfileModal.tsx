import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { path } from "../App";
import axios from "axios";
import defaultPfp from "../assets/default_pfp.png";

type EditProfileModalProps = {
  cookies: { token?: any; userId?: any };
  setShowModal: (value: boolean) => void;
  id: string;
};

export function EditProfileModal({
  cookies,
  setShowModal,
  id,
}: EditProfileModalProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const userData = await axios.get(`${path}/users/${id}`, {
          headers: { "X-Authorization": cookies.token },
        });
        setEmail(userData.data.email);
        setFirstName(userData.data.firstName);
        setLastName(userData.data.lastName);
        setImagePreview(`${path}/users/${id}/image`);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleChangePassword = () => {
    if (changingPassword) {
      setNewPassword("");
      setOldPassword("");
    }
    setChangingPassword(!changingPassword);
  };

  const updateProfile = async () => {
    try {
      const body: any = { email, firstName, lastName };
      if (changingPassword && newPassword) {
        body.password = newPassword;
        body.currentPassword = oldPassword;
      }
      await axios.patch(`${path}/users/${id}`, body, {
        headers: { "X-Authorization": cookies.token },
      });
      if (imageFile) {
        await axios.put(`${path}/users/${id}/image`, imageFile, {
          headers: {
            "X-Authorization": cookies.token,
            "Content-Type": imageFile.type,
          },
        });
      }
      setShowModal(false);
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  const deletePhoto = async () => {
    try {
      await axios.delete(`${path}/users/${id}/image`, {
        headers: { "X-Authorization": cookies.token },
      });
      setImagePreview(null);
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => setShowModal(false)}
    >
      <div
        className="bg-teal-950 p-6 rounded-xl w-96 flex flex-col gap-4 text-white overflow-y-auto max-h-screen"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <p className="text-amber-300 font-bold">Edit Profile</p>
          <X className="cursor-pointer" onClick={() => setShowModal(false)} />
        </div>

        {/* Profile picture */}
        <div className="flex flex-col items-center gap-2">
          <img
            className="w-20 h-20 rounded-full object-cover"
            src={imagePreview || defaultPfp}
            onError={(e) => (e.currentTarget.src = defaultPfp)}
          />
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif"
            className="bg-white text-black text-xs"
            onChange={handleImageChange}
          />
          <button
            className="bg-red-800 rounded p-1 text-sm w-full"
            onClick={deletePhoto}
          >
            Delete Photo
          </button>
        </div>

        <p>Email</p>
        <input
          type="text"
          className="bg-white text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <p>First Name</p>
        <input
          type="text"
          className="bg-white text-black"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <p>Last Name</p>
        <input
          type="text"
          className="bg-white text-black"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <button
          className="bg-teal-700 rounded p-1 text-sm"
          onClick={toggleChangePassword}
        >
          {changingPassword ? "Cancel" : "Change Password?"}
        </button>

        {changingPassword && (
          <>
            <p>Current Password</p>
            <input
              type="password"
              className="bg-white text-black"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <p>New Password</p>
            <input
              type="password"
              className="bg-white text-black"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </>
        )}

        <button className="bg-cyan-800 rounded p-1" onClick={updateProfile}>
          Update
        </button>
      </div>
    </div>
  );
}
