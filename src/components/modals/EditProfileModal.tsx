import { X } from "lucide-react";
import { ProfileForm } from "../ProfileForm";
import axios from "axios";
import { path } from "../../App";
import { useNavigate } from "react-router-dom";

type EditProfileModalProps = {
  cookies: { token?: any; userId?: any };
  setShowModal: (value: boolean) => void;
  id: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
};

export function EditProfileModal({
  cookies,
  setShowModal,
  id,
  user,
}: EditProfileModalProps) {
  const navigate = useNavigate();

  const updateProfile = async (data: {
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    currentPassword?: string;
    imageFile?: File | null;
  }) => {
    try {
      const body: any = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      };

      if (data.password) {
        body.password = data.password;
        body.currentPassword = data.currentPassword;
      }

      await axios.patch(`${path}/users/${id}`, body, {
        headers: {
          "X-Authorization": cookies.token,
        },
      });

      if (data.imageFile) {
        await axios.put(`${path}/users/${id}/image`, data.imageFile, {
          headers: {
            "X-Authorization": cookies.token,
            "Content-Type": data.imageFile.type,
          },
        });
      }

      setShowModal(false);
      navigate("/search");
      window.location.reload();
    } catch (e) {
      throw e;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => setShowModal(false)}
    >
      <div
        className="glass p-6 rounded-xl w-96 max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <p className="text-amber-300 font-bold">Edit Profile</p>
          <X
            className="cursor-pointer text-white"
            onClick={() => setShowModal(false)}
          />
        </div>

        <ProfileForm
          mode="edit"
          initialValues={{
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            imagePreview: `${path}/users/${id}/image`,
          }}
          onSubmit={updateProfile}
        />
      </div>
    </div>
  );
}
