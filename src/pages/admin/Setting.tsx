// SettingsPage.Switches.tsx
import React, { useEffect, useState } from "react";
import {
  SaveOutlined,
  RollbackOutlined,
  UploadOutlined,
  SettingOutlined,
  HomeOutlined,
  BellOutlined,
  TeamOutlined,
  EyeOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Switch } from "antd";
// If you don't have global antd CSS, uncomment the appropriate import below (depends on your version):
// import 'antd/dist/antd.css'; // AntD v4/v5 legacy
// or for reset-style:
// import 'antd/dist/reset.css';

type NotificationChannel = "email" | "sms" | "webhook";

interface IntegrationSettings {
  accounting?: { provider: string; apiKey?: string };
  shipping?: { provider: string; apiKey?: string };
  webhookUrl?: string;
}

interface UserRole {
  id: string;
  email: string;
  role: "admin" | "manager" | "staff";
  active: boolean;
}

interface Settings {
  companyName: string;
  companyEmail: string;
  address: string;
  phone?: string;
  logoDataUrl?: string;

  defaultWarehouse: string;
  lowStockThreshold: number;
  autoReorder: boolean;
  autoReorderQuantity: number;

  notifications: {
    enabled: boolean;
    channels: NotificationChannel[];
    notifyLowStock: boolean;
    notifyNewOrder: boolean;
  };

  integrations: IntegrationSettings;

  users: UserRole[];
}

const LOCAL_KEY = "mngmt_settings_v1";

const defaultSettings: Settings = {
  companyName: "Demo Company",
  companyEmail: "hello@demo.com",
  address: "123 Demo St, District 1, HCMC",
  phone: "+84 912 345 678",
  logoDataUrl: undefined,

  defaultWarehouse: "HCMC Warehouse",
  lowStockThreshold: 10,
  autoReorder: false,
  autoReorderQuantity: 20,

  notifications: {
    enabled: true,
    channels: ["email"],
    notifyLowStock: true,
    notifyNewOrder: true,
  },

  integrations: {
    accounting: { provider: "Xero", apiKey: "" },
    shipping: { provider: "VNPost", apiKey: "" },
    webhookUrl: "",
  },

  users: [
    { id: "u-1", email: "admin@demo.com", role: "admin", active: true },
    { id: "u-2", email: "manager@demo.com", role: "manager", active: true },
  ],
};

function readSettings(): Settings {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) } as Settings;
  } catch {
    return defaultSettings;
  }
}

/* ----------------- Small UI helpers ----------------- */
function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg flex items-center gap-3 text-black">
          {icon}
          <span>{title}</span>
        </h2>
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-black">{children}</label>
  );
}

function SmallBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-800">
      {children}
    </span>
  );
}

export default function SettingsPage(): JSX.Element {
  const [settings, setSettings] = useState<Settings>(() => readSettings());
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showLogoPreview, setShowLogoPreview] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3500);
    return () => clearTimeout(t);
  }, [message]);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => {
      const next = { ...s, [key]: value };
      setDirty(true);
      return next;
    });
  };

  const updateNested = <T extends object, K extends keyof Settings>(
    key: K,
    patch: Partial<T>
  ) => {
    setSettings((s) => {
      const next = { ...s } as Settings;
      // @ts-ignore
      next[key] = { ...(next[key] || {}), ...(patch || {}) };
      setDirty(true);
      return next;
    });
  };

  const save = () => {
    if (!settings.companyName || !settings.companyEmail) {
      setMessage("Please enter company name and company email.");
      return;
    }
    localStorage.setItem(LOCAL_KEY, JSON.stringify(settings));
    setDirty(false);
    setMessage("Settings saved successfully.");
  };

  const resetDefaults = () => {
    if (!confirm("Are you sure you want to reset to defaults?")) return;
    setSettings(defaultSettings);
    localStorage.removeItem(LOCAL_KEY);
    setDirty(false);
    setMessage("Reset to default settings.");
  };

  const onLogoChange = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      update("logoDataUrl", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const toggleNotificationChannel = (channel: NotificationChannel) => {
    setSettings((s) => {
      const channels = new Set(s.notifications.channels);
      if (channels.has(channel)) channels.delete(channel);
      else channels.add(channel);
      const next = {
        ...s,
        notifications: { ...s.notifications, channels: Array.from(channels) },
      };
      setDirty(true);
      return next;
    });
  };

  const addUser = () => {
    const email = prompt("New user email:");
    if (!email) return;
    const newUser: UserRole = {
      id: `u-${Date.now()}`,
      email,
      role: "staff",
      active: true,
    };
    setSettings((s) => ({ ...s, users: [...s.users, newUser] }));
    setDirty(true);
  };

  const updateUser = (id: string, patch: Partial<UserRole>) => {
    setSettings((s) => ({
      ...s,
      users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
    }));
    setDirty(true);
  };

  const removeUser = (id: string) => {
    if (!confirm("Remove this user?")) return;
    setSettings((s) => ({ ...s, users: s.users.filter((u) => u.id !== id) }));
    setDirty(true);
  };

  const auditLogs = [
    {
      id: 1,
      date: "2025-09-09 09:12",
      actor: "admin",
      action: "Updated lowStockThreshold 5 → 10",
    },
    {
      id: 2,
      date: "2025-09-08 14:50",
      actor: "manager",
      action: "Created new webhook",
    },
    {
      id: 3,
      date: "2025-09-07 11:23",
      actor: "admin",
      action: "Disabled autoReorder",
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-white text-black">
      {/* Local style override: make AntD Switch checked color black */}
      <style>{`
        /* make checked switch background black */
        .ant-switch.ant-switch-checked {
          background-color: #000 !important;
          border-color: #000 !important;
        }
        /* ensure inner knob blends nicely */
        .ant-switch-checked .ant-switch-inner {
          background-color: #000 !important;
        }
        /* a tiny visual tweak to switch when disabled */
        .ant-switch-disabled {
          opacity: 0.6;
        }
      `}</style>

      {/* Header */}
      <div className="p-6 border-b bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3 text-black">
              <SettingOutlined className="text-xl text-black" />
              <span>System Settings</span>
            </h1>
            <p className="text-gray-700">
              General settings, notifications and user management.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAuditModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-black bg-white hover:bg-black hover:text-white text-black rounded-sm transition-colors duration-300"
              title="View audit logs"
            >
              <EyeOutlined /> View audit
            </button>

            <button
              onClick={save}
              className="flex items-center gap-2 px-4 py-2 border border-black bg-black hover:bg-white hover:text-black text-white rounded-sm transition-colors duration-300"
              title="Save"
            >
              <SaveOutlined /> Save
            </button>

            <button
              onClick={resetDefaults}
              className="flex items-center gap-2 px-4 py-2 border border-black bg-white hover:bg-black hover:text-white text-red-500 rounded-sm transition-colors duration-300"
              title="Reset to defaults"
            >
              <RollbackOutlined /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-2">
            <Section title="Company Information" icon={<HomeOutlined />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <input
                    className="mt-1 p-3 border rounded-lg w-full"
                    value={settings.companyName}
                    onChange={(e) => update("companyName", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <input
                    className="mt-1 p-3 border rounded-lg w-full"
                    value={settings.companyEmail}
                    onChange={(e) => update("companyEmail", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Phone</Label>
                  <input
                    className="mt-1 p-3 border rounded-lg w-full"
                    value={settings.phone || ""}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Address</Label>
                  <input
                    className="mt-1 p-3 border rounded-lg w-full"
                    value={settings.address}
                    onChange={(e) => update("address", e.target.value)}
                  />
                </div>
              </div>
            </Section>

            <Section title="Notifications" icon={<BellOutlined />}>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.notifications.notifyLowStock}
                      onChange={(checked) =>
                        updateNested("notifications", {
                          notifyLowStock: checked,
                        })
                      }
                      aria-label="Notify low stock"
                    />
                    <span>Notify when stock is low</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.notifications.notifyNewOrder}
                      onChange={(checked) =>
                        updateNested("notifications", {
                          notifyNewOrder: checked,
                        })
                      }
                      aria-label="Notify new order"
                    />
                    <span>Notify on new orders</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={settings.notifications.enabled}
                      onChange={(checked) =>
                        updateNested("notifications", { enabled: checked })
                      }
                      aria-label="Enable notifications"
                    />
                    <span>Enable system notifications</span>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Users & Roles" icon={<TeamOutlined />}>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Manage system accounts and permissions.
                </div>
                <div>
                  <button className="px-3 py-2 bg-black text-white rounded-sm">
                    Add user
                  </button>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-center text-sm font-semibold">
                        Email
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-semibold">
                        Role
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-semibold">
                        Active
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-semibold"></th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {settings.users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-center">{u.email}</td>
                        <td className="px-4 py-3 text-center">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              updateUser(u.id, {
                                role: e.target.value as UserRole["role"],
                              })
                            }
                            className="p-2 border rounded"
                          >
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="staff">Staff</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Switch
                            checked={u.active}
                            onChange={(checked) =>
                              updateUser(u.id, { active: checked })
                            }
                            aria-label={`Active ${u.email}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => removeUser(u.id)}
                              className=" text-red-400 hover:bg-red-200 rounded-full transition-colors"
                            >
                              <DeleteOutlined className="p-2" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {settings.users.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-6 text-center text-gray-400"
                        >
                          No users yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Section>
          </div>

          {/* Right column — Redesigned */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-black">
                    Quick Overview
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">
                    Live snapshot of important settings
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <SmallBadge>Live</SmallBadge>
                  <div className="text-xs text-gray-500">Updated</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 text-black">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">Company</div>
                  <div className="text-sm font-medium text-black">
                    {settings.companyName}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">Default warehouse</div>
                  <div className="text-sm font-medium text-black">
                    {settings.defaultWarehouse}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">Auto reorder</div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        settings.autoReorder
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {settings.autoReorder ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div className="text-sm text-gray-700">
                    Notification channels
                  </div>
                  <div className="text-sm font-medium text-black text-right">
                    {settings.notifications.channels.length
                      ? settings.notifications.channels.join(", ")
                      : "—"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-black">Logo & Brand</h3>
                <div className="text-sm text-gray-500">
                  Recommended 400×400 • PNG/JPG
                </div>
              </div>

              <div
                className="relative border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center gap-3 text-center hover:border-gray-400 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer?.files?.[0];
                  if (f) onLogoChange(f);
                }}
                role="button"
                tabIndex={0}
                aria-label="Drop logo here or click to upload"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    /* noop */
                  }
                }}
              >
                {settings.logoDataUrl ? (
                  <img
                    src={settings.logoDataUrl}
                    alt="logo preview"
                    className="w-28 h-28 object-contain rounded-md border"
                  />
                ) : (
                  <div className="w-28 h-28 flex items-center justify-center rounded-md bg-gray-50 border">
                    <UploadOutlined/>
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  {settings.logoDataUrl
                    ? "Drag & drop to replace"
                    : "Drag & drop logo here or click to upload"}
                </div>
                <label className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-800 rounded-sm cursor-pointer">
                  <UploadOutlined />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      onLogoChange(e.target.files ? e.target.files[0] : null)
                    }
                    className="hidden"
                  />
                  Upload
                </label>
                <div className="w-full flex gap-2 mt-3">
                  <button
                    onClick={() => setShowLogoPreview(true)}
                    disabled={!settings.logoDataUrl}
                    className="flex-1 px-3 py-2 rounded-sm border text-sm disabled:opacity-50"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => update("logoDataUrl", undefined)}
                    disabled={!settings.logoDataUrl}
                    className="px-3 py-2 rounded-sm border text-sm text-red-600 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Logo preview modal */}
      {showLogoPreview && settings.logoDataUrl && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 max-w-lg w-full">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold">Preview Logo</h3>
              <button onClick={() => setShowLogoPreview(false)} className="p-1">
                <CloseOutlined />
              </button>
            </div>
            <div className="flex items-center justify-center">
              <img
                src={settings.logoDataUrl}
                alt="logo preview"
                className="max-h-80 object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Audit modal */}
      {showAuditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Audit logs</h3>
              <button onClick={() => setShowAuditModal(false)} className="p-1">
                <CloseOutlined />
              </button>
            </div>

            <div className="space-y-3">
              {auditLogs.map((a) => (
                <div key={a.id} className="p-3 border rounded-md bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                      {a.date} • {a.actor}
                    </div>
                    <div className="text-sm text-gray-500">#{a.id}</div>
                  </div>
                  <div className="mt-1">{a.action}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
