"use client";

import { useActionState, useState } from "react";
import {
  addBusinessUser,
  resetBusinessUserPassword,
  toggleBusinessUser,
  removeBusinessUser,
  type UserState,
} from "@/lib/actions/superadmin-actions";

const field =
  "rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold";

type U = { id: string; name: string; email: string; role: string; isActive: boolean };

function UserRow({ user }: { user: U }) {
  const [state, action, pending] = useActionState<UserState, FormData>(resetBusinessUserPassword, {});
  const [resetting, setResetting] = useState(false);

  return (
    <div className="border-b border-white/5 py-3 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {user.name || user.email}
            <span className="ml-2 text-xs text-gold">{user.role}</span>
            {!user.isActive && <span className="ml-1 text-xs text-red-300">· disabled</span>}
          </p>
          <p className="truncate text-xs text-muted">{user.email}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setResetting((v) => !v)}
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted hover:border-gold hover:text-gold"
          >
            Reset password
          </button>
          <form action={toggleBusinessUser}>
            <input type="hidden" name="userId" value={user.id} />
            <button className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted hover:text-paper">
              {user.isActive ? "Disable" : "Enable"}
            </button>
          </form>
          <form action={removeBusinessUser}>
            <input type="hidden" name="userId" value={user.id} />
            <button className="rounded-full border border-red-400/30 px-3 py-1 text-xs text-red-300 hover:bg-red-400/10">
              Remove
            </button>
          </form>
        </div>
      </div>

      {resetting && (
        <form action={action} className="mt-2 flex flex-wrap items-center gap-2">
          <input type="hidden" name="userId" value={user.id} />
          <input name="password" type="text" required minLength={8} placeholder="New password (min 8)" className={field} />
          <button disabled={pending} className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-ink hover:bg-gold-soft disabled:opacity-60">
            {pending ? "Saving…" : "Set password"}
          </button>
          {state.error && <span className="text-xs text-red-300">{state.error}</span>}
          {state.ok && <span className="text-xs text-emerald-300">Password updated.</span>}
        </form>
      )}
    </div>
  );
}

export default function BusinessUsers({ tenantId, users }: { tenantId: string; users: U[] }) {
  const [state, action, pending] = useActionState<UserState, FormData>(addBusinessUser, {});
  const [adding, setAdding] = useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold">Users ({users.length})</h2>
        <button onClick={() => setAdding((v) => !v)} className="text-sm text-gold hover:underline">
          {adding ? "Close" : "+ Add user"}
        </button>
      </div>

      {adding && (
        <form action={action} className="mb-4 grid gap-3 rounded-xl border border-white/10 bg-ink/40 p-4 sm:grid-cols-2">
          <input type="hidden" name="tenantId" value={tenantId} />
          {state.error && <p className="text-sm text-red-300 sm:col-span-2">{state.error}</p>}
          {state.ok && <p className="text-sm text-emerald-300 sm:col-span-2">User added.</p>}
          <input name="name" required placeholder="Name" className={field} />
          <input name="email" type="email" required placeholder="Email" className={field} />
          <select name="role" defaultValue="STAFF" className={field}>
            <option value="OWNER">Owner</option>
            <option value="STAFF">Staff</option>
          </select>
          <input name="password" type="text" placeholder="Password (optional, min 8)" className={field} />
          <button disabled={pending} className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink hover:bg-gold-soft disabled:opacity-60 sm:col-span-2 sm:justify-self-start">
            {pending ? "Adding…" : "Add user"}
          </button>
        </form>
      )}

      <div>
        {users.map((u) => <UserRow key={u.id} user={u} />)}
        {users.length === 0 && <p className="text-sm text-muted">No users.</p>}
      </div>
    </div>
  );
}
