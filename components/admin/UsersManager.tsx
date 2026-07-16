"use client";

import { useState } from "react";
import { GRANTABLE_SECTIONS, parsePerms } from "@/lib/permissions";
import { createUser, updateUser, deleteUser } from "@/lib/actions/user-actions";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string;
  isActive: boolean;
};

const inputCls =
  "w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold";

function PermGrid({ selected }: { selected: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
      {GRANTABLE_SECTIONS.map((s) => (
        <label
          key={s.key}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs"
        >
          <input
            type="checkbox"
            name="perms"
            value={s.key}
            defaultChecked={selected.includes(s.key)}
          />
          <span>
            {s.icon} {s.label}
          </span>
        </label>
      ))}
    </div>
  );
}

function AddUser() {
  const [role, setRole] = useState("STAFF");
  return (
    <form
      action={createUser}
      className="space-y-3 rounded-2xl border border-gold/25 bg-gold/5 p-5"
    >
      <h2 className="font-heading text-lg font-bold">Add a user</h2>
      <p className="text-xs text-muted">
        Enter the person&apos;s Google email — they sign in with that Google
        account. Owners get full access; staff get only the sections you tick.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" placeholder="Name *" className={inputCls} required />
        <input
          name="email"
          type="email"
          placeholder="Google email *"
          className={inputCls}
          required
        />
      </div>
      <div className="flex items-center gap-3">
        <label className="text-xs text-muted">Role</label>
        <select
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={inputCls + " w-auto"}
        >
          <option value="STAFF">Staff (limited)</option>
          <option value="OWNER">Owner (full access)</option>
        </select>
      </div>
      {role === "STAFF" && (
        <div>
          <p className="mb-1.5 text-xs text-muted">Allowed sections</p>
          <PermGrid selected={[]} />
        </div>
      )}
      <button className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft">
        Add user
      </button>
    </form>
  );
}

function UserRow({ user, meId }: { user: AdminUser; meId: string }) {
  const [role, setRole] = useState(user.role === "OWNER" || user.role === "ADMIN" ? "OWNER" : "STAFF");
  const isMe = user.id === meId;

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-medium">
            {user.name}{" "}
            {isMe && <span className="text-xs text-gold">(you)</span>}
            {!user.isActive && (
              <span className="ml-2 rounded-full bg-red-400/15 px-2 py-0.5 text-[10px] text-red-300">
                disabled
              </span>
            )}
          </p>
          <p className="text-xs text-muted">{user.email}</p>
        </div>
        {!isMe && (
          <form action={deleteUser.bind(null, user.id)}>
            <button className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-muted hover:border-red-400/40 hover:text-red-300">
              Remove
            </button>
          </form>
        )}
      </div>

      <form action={updateUser.bind(null, user.id)} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="name" defaultValue={user.name} className={inputCls} />
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={inputCls}
          >
            <option value="STAFF">Staff (limited)</option>
            <option value="OWNER">Owner (full access)</option>
          </select>
        </div>

        {role === "STAFF" && (
          <div>
            <p className="mb-1.5 text-xs text-muted">Allowed sections</p>
            <PermGrid selected={parsePerms(user.permissions)} />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={user.isActive}
            />
            Active (can sign in)
          </label>
          <button className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink hover:bg-gold-soft">
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default function UsersManager({
  users,
  meId,
}: {
  users: AdminUser[];
  meId: string;
}) {
  return (
    <div className="space-y-6">
      <AddUser />
      <div className="space-y-4">
        {users.map((u) => (
          <UserRow key={u.id} user={u} meId={meId} />
        ))}
      </div>
      <p className="text-xs text-muted">
        Note: when you change someone&apos;s access, it takes full effect the
        next time they sign in.
      </p>
    </div>
  );
}
