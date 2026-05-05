import { useState, useRef } from "react";
import defaultPfp from "../assets/default_pfp.png";

type ProfileFormProps = {
  mode: "register" | "edit";
  initialValues?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    imagePreview?: string | null;
  };
  onSubmit: (data: {
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    currentPassword?: string;
    imageFile?: File | null;
  }) => Promise<void>;
};

export function ProfileForm({
  mode,
  initialValues,
  onSubmit,
}: ProfileFormProps) {
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [firstName, setFirstName] = useState(initialValues?.firstName ?? "");
  const [lastName, setLastName] = useState(initialValues?.lastName ?? "");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues?.imagePreview ?? null,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    let allErrors = "";

    if (email.length === 0 || firstName.length === 0 || lastName.length === 0) {
      allErrors += "Please fill in all the required info.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      allErrors += " Email is invalid.";
    }

    if (mode === "register" || changingPassword) {
      if (password.length < 6) {
        allErrors += " The password must be at least 6 characters in length.";
      }
    }

    if (mode === "edit" && changingPassword && currentPassword !== password) {
      allErrors += " Old password and new password does not match.";
    }

    if (allErrors.length > 0) {
      setErrorMessage(allErrors.trimStart());
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await onSubmit({
        email,
        firstName,
        lastName,
        password: password || undefined,
        currentPassword: currentPassword || undefined,
        imageFile,
      });
    } catch (e: any) {
      if (e.response?.status === 403) {
        setErrorMessage("Email is already in use.");
      } else {
        setErrorMessage(e.response?.data);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 text-white text-sm items-center">
      <p className="text-white text-2xl">
        {mode === "register" ? "Register" : "Edit Profile"}
      </p>

      <div className="flex gap-2">
        <p>Email:</p>
        <input
          className="bg-white text-black rounded-2xl"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <p>First Name:</p>
        <input
          className="bg-white text-black rounded-2xl"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <p>Last Name:</p>
        <input
          className="bg-white text-black rounded-2xl"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      {mode === "edit" && (
        <button
          className="glass px-2 rounded-2xl cursor-pointer"
          onClick={() => setChangingPassword(!changingPassword)}
        >
          {changingPassword ? "Cancel Password Change" : "Change Password"}
        </button>
      )}

      {(mode === "register" || changingPassword) && (
        <>
          {mode === "edit" && (
            <>
              <p>Current Password:</p>
              <input
                className="bg-white text-black rounded-2xl"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </>
          )}

          <div className="flex gap-2 items-center">
            <p>{mode === "register" ? "Password:" : "New Password:"}</p>

            <input
              className="bg-white text-black rounded-2xl"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="glass px-2 rounded-2xl cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </>
      )}

      <div className="flex gap-2">
        <img
          className="w-20 h-20 rounded-full object-cover"
          src={imagePreview || defaultPfp}
          onError={(e) => (e.currentTarget.src = defaultPfp)}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/gif"
          className="bg-white text-black text-xs w-full"
          onChange={handleImageChange}
        />

        {imageFile && (
          <button
            className="bg-red-600 px-2 rounded"
            onClick={() => {
              setImageFile(null);
              setImagePreview(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          >
            Remove
          </button>
        )}
      </div>

      <button
        className="glass px-2 rounded-2xl cursor-pointer"
        onClick={handleSubmit}
      >
        Submit
      </button>

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}
