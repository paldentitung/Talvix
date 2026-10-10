import { useState, useEffect } from "react";
import DangerTab from "./DangerTab";
import NotificationsTab from "./NotificationsTab";
import ProfileTab from "./ProfileTab";
import type { Notifications, TabId } from "./Shared";
import { useGetCurrentUser } from "../../../features/users/hooks/useGetCurrentUser";
import { useUserUpdateProfile } from "../../../features/users/hooks/useUpdateUserProfile";
import toast from "react-hot-toast";
import ChangePasswordCard from "../../../shared/components/ChangePasswordCard";

const tabs: { id: TabId; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "Security" },
  { id: "danger", label: "Danger zone" },
];

const RecruiterSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const { data: currentUser, isLoading } = useGetCurrentUser();
  const {
    mutate: updateProfile,
    isPending: isSaving,
    isSuccess,
    isError,
  } = useUserUpdateProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    setFirstName(currentUser.firstName ?? "");
    setLastName(currentUser.lastName ?? "");
    setPhone(currentUser.phone ?? "");
  }, [currentUser]);

  const handleSaveProfile = () => {
    updateProfile(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully!");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update profile.");
        },
      },
    );
  };

  const [notifications, setNotifications] = useState<Notifications>({
    newApplicants: true,
    jobExpiring: true,
    weeklySummary: false,
    productUpdates: false,
  });

  const updateNotification = (key: keyof Notifications, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 overflow-x-auto border-b border-(--border) pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "border-(--primary) text-(--primary)"
                : "border-transparent text-(--text-secondary) hover:text-(--text-primary)"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <ProfileTab
          firstName={firstName}
          lastName={lastName}
          phone={phone}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onPhoneChange={setPhone}
          onSave={handleSaveProfile}
          isSaving={isSaving}
          isSuccess={isSuccess}
          isError={isError}
          isLoading={isLoading}
        />
      )}
      {activeTab === "notifications" && (
        <NotificationsTab
          values={notifications}
          onChange={updateNotification}
        />
      )}

      {activeTab === "security" && <ChangePasswordCard />}
      {activeTab === "danger" && <DangerTab />}
    </div>
  );
};

export default RecruiterSettingsPage;
