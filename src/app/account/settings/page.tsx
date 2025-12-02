import {
  DeleteAccountCard,
  ChangePasswordCard,
  ChangeEmailCard,
  SessionsCard,
  UpdateAvatarCard,
  UpdateUsernameCard,
  UpdateNameCard,
  AccountsCard,
} from "@daveyplate/better-auth-ui";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 w-full">
        <div className="space-y-6">
          <UpdateNameCard />
          <UpdateUsernameCard />
          <UpdateAvatarCard />
        </div>
        <div className="space-y-6">
          <ChangePasswordCard />
          <ChangeEmailCard />
          <SessionsCard />
          <DeleteAccountCard />
        </div>
      </div>
      {/* <AccountsCard /> */}
    </div>
  );
}
