// SettingsPage.tsx
import React, { useEffect, useState } from "react";
import {
  SaveOutlined,
  RollbackOutlined,
  UploadOutlined,
  SettingOutlined,
  HomeOutlined,
  DatabaseOutlined,
  BellOutlined,
  LinkOutlined,
  TeamOutlined,
  EyeOutlined,
  CloseOutlined,
} from "@ant-design/icons";

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
  companyName: "Công ty Demo",
  companyEmail: "hello@demo.com",
  address: "123 Đường Demo, Quận 1, TP.HCM",
  phone: "+84 912 345 678",
  logoDataUrl: undefined,

  defaultWarehouse: "Kho Hồ Chí Minh",
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

export default function SettingsPage(): JSX.Element {
  // NOTE: outer container is h-screen flex flex-col so inner content can be flex-1 overflow-auto
  const [settings, setSettings] = useState<Settings>(() => readSettings());
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showLogoPreview, setShowLogoPreview] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3000);
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
      setMessage("Vui lòng điền tên công ty và email.");
      return;
    }
    localStorage.setItem(LOCAL_KEY, JSON.stringify(settings));
    setDirty(false);
    setMessage("Lưu cấu hình thành công.");
  };

  const resetDefaults = () => {
    if (!confirm("Bạn có chắc muốn reset về mặc định?")) return;
    setSettings(defaultSettings);
    localStorage.removeItem(LOCAL_KEY);
    setDirty(false);
    setMessage("Đã reset về cấu hình mặc định.");
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
      const next = { ...s, notifications: { ...s.notifications, channels: Array.from(channels) } };
      setDirty(true);
      return next;
    });
  };

  const addUser = () => {
    const email = prompt("Email người dùng mới:");
    if (!email) return;
    const newUser: UserRole = { id: `u-${Date.now()}`, email, role: "staff", active: true };
    setSettings((s) => ({ ...s, users: [...s.users, newUser] }));
    setDirty(true);
  };

  const updateUser = (id: string, patch: Partial<UserRole>) => {
    setSettings((s) => ({ ...s, users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) }));
    setDirty(true);
  };

  const removeUser = (id: string) => {
    if (!confirm("Xóa người dùng này?")) return;
    setSettings((s) => ({ ...s, users: s.users.filter((u) => u.id !== id) }));
    setDirty(true);
  };

  const auditLogs = [
    { id: 1, date: "2025-09-09 09:12", actor: "admin", action: "Cập nhật lowStockThreshold từ 5 → 10" },
    { id: 2, date: "2025-09-08 14:50", actor: "manager", action: "Tạo webhook mới" },
    { id: 3, date: "2025-09-07 11:23", actor: "admin", action: "Tắt autoReorder" },
  ];

  return (
    // IMPORTANT: use h-screen flex flex-col so main can scroll
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-6 border-b bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <SettingOutlined className="text-xl" />
              Cấu hình hệ thống
            </h1>
            <p className="text-gray-600">Thiết lập chung, tồn kho, thông báo, tích hợp và quản lý người dùng.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAuditModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg border"
              title="Xem audit logs"
            >
              <EyeOutlined /> Xem audit
            </button>

            <button
              onClick={save}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
              title="Lưu"
            >
              <SaveOutlined /> Lưu
            </button>

            <button
              onClick={resetDefaults}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg border"
              title="Reset về mặc định"
            >
              <RollbackOutlined /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT: scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            <section className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg flex items-center gap-2"><HomeOutlined /> Thông tin công ty</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên công ty</label>
                  <input
                    className="mt-1 p-3 border rounded-lg w-full"
                    value={settings.companyName}
                    onChange={(e) => update("companyName", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email liên hệ</label>
                  <input
                    className="mt-1 p-3 border rounded-lg w-full"
                    value={settings.companyEmail}
                    onChange={(e) => update("companyEmail", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                  <input
                    className="mt-1 p-3 border rounded-lg w-full"
                    value={settings.phone || ""}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                  <input
                    className="mt-1 p-3 border rounded-lg w-full"
                    value={settings.address}
                    onChange={(e) => update("address", e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
                    {settings.logoDataUrl ? (
                      <img src={settings.logoDataUrl} alt="logo" className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-gray-400">Logo</div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer px-3 py-2 bg-blue-50 rounded-lg">
                      <UploadOutlined />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onLogoChange(e.target.files ? e.target.files[0] : null)}
                        className="hidden"
                      />
                      Tải logo
                    </label>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowLogoPreview(true)}
                        disabled={!settings.logoDataUrl}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                      >
                        Xem
                      </button>
                      <button
                        onClick={() => update("logoDataUrl", undefined)}
                        className="px-3 py-1 border rounded"
                        disabled={!settings.logoDataUrl}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border">
              <h2 className="font-semibold text-lg flex items-center gap-2"><DatabaseOutlined /> Tồn kho & Kho</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-700">Kho mặc định</label>
                  <select
                    value={settings.defaultWarehouse}
                    onChange={(e) => update("defaultWarehouse", e.target.value)}
                    className="mt-1 p-3 border rounded-lg w-full"
                  >
                    <option>Kho Hồ Chí Minh</option>
                    <option>Kho Hà Nội</option>
                    <option>Kho Đà Nẵng</option>
                    <option>Kho Cần Thơ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700">Ngưỡng sắp hết (sản phẩm)</label>
                  <input
                    type="number"
                    min={0}
                    className="mt-1 p-3 border rounded-lg w-full"
                    value={settings.lowStockThreshold}
                    onChange={(e) => update("lowStockThreshold", Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700">Auto reorder</label>
                  <div className="mt-1 flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoReorder}
                        onChange={(e) => update("autoReorder", e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm ml-1">Bật tự động đặt hàng (khi &lt;= ngưỡng)</span>
                    </label>
                  </div>
                </div>

                {settings.autoReorder && (
                  <div>
                    <label className="block text-sm text-gray-700">Số lượng đặt mỗi lần</label>
                    <input
                      type="number"
                      min={1}
                      className="mt-1 p-3 border rounded-lg w-full"
                      value={settings.autoReorderQuantity}
                      onChange={(e) => update("autoReorderQuantity", Number(e.target.value))}
                    />
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border">
              <h2 className="font-semibold text-lg flex items-center gap-2"><BellOutlined /> Thông báo</h2>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.notifications.enabled}
                      onChange={(e) => updateNested("notifications", { enabled: e.target.checked })}
                    />
                    <span className="text-sm">Bật thông báo hệ thống</span>
                  </label>

                  <div className="mt-3 space-y-2">
                    <div className="text-sm text-gray-600">Kênh nhận thông báo</div>
                    <div className="flex gap-2 mt-2">
                      <label className={`px-3 py-1 border rounded cursor-pointer ${settings.notifications.channels.includes("email") ? "bg-blue-50 border-blue-200" : ""}`}>
                        <input type="checkbox" checked={settings.notifications.channels.includes("email")} onChange={() => toggleNotificationChannel("email")} /> Email
                      </label>
                      <label className={`px-3 py-1 border rounded cursor-pointer ${settings.notifications.channels.includes("sms") ? "bg-blue-50 border-blue-200" : ""}`}>
                        <input type="checkbox" checked={settings.notifications.channels.includes("sms")} onChange={() => toggleNotificationChannel("sms")} /> SMS
                      </label>
                      <label className={`px-3 py-1 border rounded cursor-pointer ${settings.notifications.channels.includes("webhook") ? "bg-blue-50 border-blue-200" : ""}`}>
                        <input type="checkbox" checked={settings.notifications.channels.includes("webhook")} onChange={() => toggleNotificationChannel("webhook")} /> Webhook
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={settings.notifications.notifyLowStock} onChange={(e) => updateNested("notifications", { notifyLowStock: e.target.checked })} />
                    <span className="text-sm">Thông báo khi sắp hết hàng</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={settings.notifications.notifyNewOrder} onChange={(e) => updateNested("notifications", { notifyNewOrder: e.target.checked })} />
                    <span className="text-sm">Thông báo khi có đơn hàng mới</span>
                  </label>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border">
              <h2 className="font-semibold text-lg flex items-center gap-2"><LinkOutlined /> Tích hợp</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-700">Kế toán (provider)</label>
                  <input
                    className="mt-1 p-3 border rounded-lg w-full"
                    value={settings.integrations.accounting?.provider || ""}
                    onChange={(e) => updateNested<IntegrationSettings, "integrations">("integrations", { accounting: { ...(settings.integrations.accounting || {}), provider: e.target.value } })}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700">API Key Kế toán</label>
                  <input
                    className="mt-1 p-3 border rounded-lg w-full"
                    value={settings.integrations.accounting?.apiKey || ""}
                    onChange={(e) => updateNested<IntegrationSettings, "integrations">("integrations", { accounting: { ...(settings.integrations.accounting || {}), provider: e.target.value } })}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700">Giao vận (provider)</label>
                  <input
                    className="mt-1 p-3 border rounded-lg w-full"
                    value={settings.integrations.shipping?.provider || ""}
                    onChange={(e) => updateNested<IntegrationSettings, "integrations">("integrations", { shipping: { ...(settings.integrations.shipping || {}), provider: e.target.value } })}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700">API Key Giao vận</label>
                  <input
                    className="mt-1 p-3 border rounded-lg w-full"
                    value={settings.integrations.shipping?.apiKey || ""}
                    onChange={(e) => updateNested<IntegrationSettings, "integrations">("integrations", { shipping: { ...(settings.integrations.shipping || {}), provider: e.target.value } })}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700">Webhook URL (nếu có)</label>
                  <input
                    className="mt-1 p-3 border rounded-lg w-full"
                    value={settings.integrations.webhookUrl || ""}
                    onChange={(e) => updateNested<IntegrationSettings, "integrations">("integrations", { webhookUrl: e.target.value })}
                    placeholder="https://example.com/webhook"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg flex items-center gap-2"><TeamOutlined /> Người dùng & vai trò</h2>
                <div className="flex items-center gap-2">
                  <button onClick={addUser} className="px-3 py-2 bg-blue-600 text-white rounded">Thêm người dùng</button>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Email</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Vai trò</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Active</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Hành động</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {settings.users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{u.email}</td>
                        <td className="px-4 py-3">
                          <select value={u.role} onChange={(e) => updateUser(u.id, { role: e.target.value as UserRole["role"] })} className="p-2 border rounded">
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="staff">Staff</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input type="checkbox" checked={u.active} onChange={(e) => updateUser(u.id, { active: e.target.checked })} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => updateUser(u.id, { active: !u.active })} className="px-3 py-1 border rounded text-sm">
                              {u.active ? "Disable" : "Enable"}
                            </button>
                            <button onClick={() => removeUser(u.id)} className="px-3 py-1 border rounded text-sm text-red-600">Xóa</button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {settings.users.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-gray-400">Chưa có người dùng.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="font-semibold mb-2">Tổng quan nhanh</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <div><strong>Công ty:</strong> {settings.companyName}</div>
                <div><strong>Kho mặc định:</strong> {settings.defaultWarehouse}</div>
                <div><strong>Auto reorder:</strong> {settings.autoReorder ? "Bật" : "Tắt"}</div>
                <div><strong>Channels:</strong> {settings.notifications.channels.join(", ") || "—"}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="font-semibold mb-2">Preview Logo</h3>
              <div className="w-full h-36 bg-gray-50 rounded-lg flex items-center justify-center">
                {settings.logoDataUrl ? <img src={settings.logoDataUrl} className="max-h-32 object-contain" alt="logo preview" /> : <div className="text-gray-400">Chưa có logo</div>}
              </div>
              <div className="mt-3 text-sm text-gray-500">Kích thước khuyến nghị: 400×400, PNG/JPG</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="font-semibold mb-2">Hành động</h3>
              <div className="flex flex-col gap-2">
                <button onClick={save} className="px-3 py-2 bg-blue-600 text-white rounded flex items-center gap-2 justify-center"><SaveOutlined /> Lưu thay đổi</button>
                <button onClick={resetDefaults} className="px-3 py-2 bg-red-50 text-red-700 rounded flex items-center gap-2 justify-center"><RollbackOutlined /> Reset mặc định</button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating message */}
      {message && (
        <div className="fixed right-6 bottom-6 bg-white border shadow px-4 py-3 rounded-lg z-50">
          <div className="text-sm">{message}</div>
        </div>
      )}

      {/* Logo preview modal */}
      {showLogoPreview && settings.logoDataUrl && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 max-w-lg w-full">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold">Preview Logo</h3>
              <button onClick={() => setShowLogoPreview(false)} className="p-1"><CloseOutlined /></button>
            </div>
            <div className="flex items-center justify-center">
              <img src={settings.logoDataUrl} alt="logo preview" className="max-h-80 object-contain" />
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
              <button onClick={() => setShowAuditModal(false)} className="p-1"><CloseOutlined /></button>
            </div>

            <div className="space-y-3">
              {auditLogs.map((a) => (
                <div key={a.id} className="p-3 border rounded-md bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">{a.date} • {a.actor}</div>
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
