import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { path } from "../App";
import axios from "axios";

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

  useEffect(() => {
    (async () => {
      try {
        const userData = await axios.get(`${path}/users/${id}`, {
          headers: { "X-Authorization": cookies.token },
        });
        setEmail(userData.data.email);
        setFirstName(userData.data.firstName);
        setLastName(userData.data.lastName);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const updateProfile = async () => {
    try {
      const body: any = { email, firstName, lastName };
      if (newPassword) {
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
        className="bg-teal-950 p-6 rounded-xl w-96 flex flex-col gap-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <p className="text-amber-300 font-bold">Edit Profile</p>
          <X className="cursor-pointer" onClick={() => setShowModal(false)} />
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

        <p>Current Password</p>
        <input
          type="password"
          className="bg-white text-black"
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <p>New Password</p>
        <input
          type="password"
          className="bg-white text-black"
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <p>Profile Image</p>
        <input
          type="file"
          accept="image/png, image/jpeg, image/gif"
          className="bg-white text-black"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />

        <button
          className="bg-red-800 rounded p-1"
          onClick={() => deletePhoto()}
        >
          Delete Photo
        </button>

        <button
          className="bg-cyan-800 rounded p-1"
          onClick={() => updateProfile()}
        >
          Update
        </button>
      </div>
    </div>
  );
}
