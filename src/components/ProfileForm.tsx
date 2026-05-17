import { useState, useRef } from "react";
import defaultPfp from "../assets/default_pfp.png";
import { Eye, EyeClosed } from "lucide-react";

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
    imagePreview?: string | null;
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
  const [imageFile, setImageFile] = useState<File | null>();
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

    if (
      mode === "edit" &&
      initialValues?.firstName === firstName &&
      initialValues?.lastName === lastName &&
      initialValues.email === email &&
      !changingPassword
    ) {
      allErrors += " All information is identical to the previous one.";
    }

    if (mode === "register" || changingPassword) {
      if (password.length < 6) {
        allErrors += " The password must be at least 6 characters in length.";
      }
    }

    if (mode === "edit" && changingPassword && currentPassword === password) {
      allErrors +=
        " The current password and the new password cannot be the same.";
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
        imagePreview,
      });
    } catch (e: any) {
      console.log("Error:", e.response?.statusText);
      setErrorMessage(e.response?.statusText || "An error occurred");
    }
  };

  return (
    <div className="flex flex-col gap-2 text-white text-sm items-center p-5">
      <p className="text-white text-xl pb-3">
        {mode === "register" ? "Register" : "Edit Profile"}
      </p>

      <div className="flex gap-2 w-full">
        <p>
          Email<span className="text-rose-400">*</span>
        </p>
        <input
          className="pl-1 rounded-2xl glass flex-1"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex gap-2 w-full">
        <p>
          First Name<span className="text-rose-400">*</span>
        </p>
        <input
          className="pl-1 rounded-2xl glass flex-1"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      <div className="flex gap-2 w-full">
        <p>
          Last Name<span className="text-rose-400">*</span>
        </p>
        <input
          className="pl-1 rounded-2xl glass flex-1"
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
        <div className="gap-2 flex flex-col w-full">
          {mode === "edit" && (
            <div className="flex gap-2 items-center w-full">
              <p className="">
                Current Pass<span className="text-rose-400">*</span>
              </p>
              <input
                className="pl-1 rounded-2xl glass flex-1"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          )}

          <div className="flex gap-2 items-center w-full">
            <p className="">
              {mode === "register" ? "Password" : "New Pass"}
              <span className="text-rose-400">*</span>
            </p>

            <input
              className="pl-1 rounded-2xl glass flex-1"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="glass rounded-2xl p-0.5 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 items-center">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={imagePreview || defaultPfp}
          onError={(e) => (e.currentTarget.src = defaultPfp)}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/gif"
          className="text-xs glass w-45 p-1 rounded-2xl pl-2"
          onChange={handleImageChange}
        />

        {imagePreview !== null && (
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
        className="glass px-2 rounded-2xl cursor-pointer mt-3"
        onClick={handleSubmit}
      >
        Submit
      </button>
      {errorMessage && (
        <p className="text-rose-400 text-xs pt-3">
          {errorMessage !== null && errorMessage}
        </p>
      )}
    </div>
  );
}
