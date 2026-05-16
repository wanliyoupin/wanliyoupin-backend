"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/lib/auth-context";

type OrderItem = {
  id: number;
  order_status: string;
  payment_status: string;
  total_price: number;
  total_amount: number;
  actual_amount?: number;
  remark?: string;
  created_at: string;
  user?: { id: number; mobile?: string; nickname?: string };
  order_items?: Array<{
    id: number;
    product_name?: string;
    product_image_url?: string;
    product_price?: number;
    quantity?: number;
    remark?: string;
  }>;
};

function orderStatusText(s: string) {
  if (s === "pending") return "待确认";
  if (s === "confirmed") return "已确认";
  if (s === "completed") return "已完成";
  return s || "--";
}
function paymentStatusText(s: string) {
  if (s === "pending") return "待支付";
  if (s === "approved") return "已支付";
  return s || "--";
}
function formatTime(time: string) {
  if (!time) return "";
  const d = new Date(time);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${m}-${day} ${h}:${min}`;
}

export default function CompanyOrdersPage() {
  const searchParams = useSearchParams();
  const { token, company, user, isAdminForSelectedCompany } = useAuth();
  const companyIdFromUrl = searchParams.get("companyId");
  const auditFromUrl = searchParams.get("audit") === "1";
  const effectiveCompanyId =
    user?.role === "admin" && companyIdFromUrl && !Number.isNaN(Number(companyIdFromUrl))
      ? Number(companyIdFromUrl)
      : company?.id;
  const isAuditMode = user?.role === "admin" && auditFromUrl && !!companyIdFromUrl;
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");

  const [approveModal, setApproveModal] = useState(false);
  const [approvingOrder, setApprovingOrder] = useState<OrderItem | null>(null);
  const [approveAmount, setApproveAmount] = useState("");

  const [editActualModal, setEditActualModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderItem | null>(null);
  const [editActualAmount, setEditActualAmount] = useState("");

  const load = async (pageNum: number) => {
    if (!token || !effectiveCompanyId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        companyId: String(effectiveCompanyId),
        limit: String(pageSize),
        offset: String((pageNum - 1) * pageSize),
      });
      if (orderStatusFilter) params.set("orderStatus", orderStatusFilter);
      if (paymentStatusFilter) params.set("paymentStatus", paymentStatusFilter);
      if (keyword) params.set("keyword", keyword);
      const res = await fetch(`/api/admin/company/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders ?? []);
        setTotal(data.total ?? 0);
        setCurrentPage(pageNum);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, [token, effectiveCompanyId, orderStatusFilter, paymentStatusFilter, keyword]);

  const onSearch = () => setKeyword(searchInput.trim());

  const patchOrder = async (orderId: number, action: string, actual_amount?: number) => {
    if (!token) return;
    const res = await fetch(`/api/admin/company/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action, actual_amount }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "操作失败");
    return data;
  };

  const confirmOrder = async (order: OrderItem) => {
    if (!confirm("确定要确认该订单（可发货）吗？")) return;
    try {
      await patchOrder(order.id, "confirm");
      alert("订单已确认");
      load(currentPage);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "操作失败");
    }
  };

  const openApprove = (order: OrderItem) => {
    setApprovingOrder(order);
    setApproveAmount(order.total_amount != null ? String(order.total_amount) : "");
    setApproveModal(true);
  };

  const submitApprove = async () => {
    if (!approvingOrder) return;
    const v = parseFloat(approveAmount);
    if (Number.isNaN(v) || v < 0) {
      alert("请输入有效金额");
      return;
    }
    try {
      await patchOrder(approvingOrder.id, "approve_payment", v);
      alert("已确认收款");
      setApproveModal(false);
      setApprovingOrder(null);
      load(currentPage);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "操作失败");
    }
  };

  const openEditActual = (order: OrderItem) => {
    setEditingOrder(order);
    setEditActualAmount(
      order.actual_amount != null ? String(order.actual_amount) : order.total_amount != null ? String(order.total_amount) : ""
    );
    setEditActualModal(true);
  };

  const submitEditActual = async () => {
    if (!editingOrder) return;
    const v = parseFloat(editActualAmount);
    if (Number.isNaN(v) || v < 0) {
      alert("请输入有效金额");
      return;
    }
    try {
      await patchOrder(editingOrder.id, "update_actual", v);
      alert("已更新");
      setEditActualModal(false);
      setEditingOrder(null);
      load(currentPage);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "操作失败");
    }
  };

  const archiveOrder = async (order: OrderItem) => {
    if (!confirm("确定将该订单归档为已完成吗？")) return;
    try {
      await patchOrder(order.id, "complete");
      alert("已归档");
      load(currentPage);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "操作失败");
    }
  };

  if (!effectiveCompanyId) {
    return (
      <div>
        <p className="text-slate-600">请先选择公司。</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {isAuditMode && (
        <div className="flex-shrink-0 mb-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-amber-800 text-sm">
          核查模式：仅查看，不可操作
        </div>
      )}
      <h1 className="flex-shrink-0 text-xl font-semibold text-slate-800 mb-4">订单管理</h1>

      <div className="flex-shrink-0 mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder="订单号 / 收货人 / 用户手机号"
          className="w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={onSearch}
          className="rounded-lg bg-slate-600 px-3 py-2 text-sm text-white hover:bg-slate-700"
        >
          搜索
        </button>

        <span className="ml-2 text-sm font-medium text-slate-600">订单状态</span>
        <div className="flex gap-1">
          {["", "pending", "confirmed", "completed"].map((s) => (
            <button
              key={s || "all"}
              type="button"
              onClick={() => setOrderStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-sm ${orderStatusFilter === s ? "bg-indigo-600 text-white" : "border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
            >
              {s === "" ? "全部" : s === "pending" ? "待确认" : s === "confirmed" ? "已确认" : "已完成"}
            </button>
          ))}
        </div>

        {orderStatusFilter !== "completed" && (
          <>
            <span className="ml-2 text-sm font-medium text-slate-600">支付状态</span>
            <div className="flex gap-1">
              {["", "pending", "approved"].map((s) => (
                <button
                  key={s || "all"}
                  type="button"
                  onClick={() => setPaymentStatusFilter(s)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${paymentStatusFilter === s ? "bg-indigo-600 text-white" : "border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                >
                  {s === "" ? "全部" : s === "pending" ? "待支付" : "已支付"}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {loading && orders.length === 0 ? (
        <div className="flex-1 min-h-0 flex items-center">
          <p className="text-slate-500">加载中…</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <p className="text-slate-500">暂无订单</p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-slate-200 rounded-lg p-4 bg-white"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium text-slate-800">订单号: {order.id}</span>
                    <span className="ml-2 text-sm text-slate-600">
                      {orderStatusText(order.order_status)} / {paymentStatusText(order.payment_status)}
                    </span>
                  </div>
                  <span className="text-sm text-slate-600">{formatTime(order.created_at)}</span>
                </div>
                <div className="text-sm text-slate-600 mb-2">
                  用户: {order.user?.nickname || order.user?.mobile || "--"}
                </div>
                {order.order_items && order.order_items.length > 0 && (
                  <div className="text-sm text-slate-600 mb-2 space-y-1">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.product_name || "商品"} x{item.quantity}</span>
                        <span>¥{item.product_price}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100">
                  <div className="text-sm text-slate-700">
                    <span>总价: </span>
                    <span className="font-medium text-slate-800">¥{order.total_price}</span>
                    <span className="ml-2">总金额: </span>
                    <span className="font-medium text-slate-800">¥{order.total_amount}</span>
                    {order.actual_amount != null && (
                      <>
                        <span className="ml-2">实收: </span>
                        <span className="font-medium text-slate-800">¥{order.actual_amount}</span>
                      </>
                    )}
                  </div>
                  {!isAuditMode && (user?.role === "admin" || (effectiveCompanyId === company?.id && isAdminForSelectedCompany)) && order.order_status !== "completed" && (
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => openEditActual(order)}
                        className="text-sm text-slate-600 hover:underline"
                      >
                        修改实收
                      </button>
                      {order.order_status === "pending" && (
                        <button
                          type="button"
                          onClick={() => confirmOrder(order)}
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          确认订单
                        </button>
                      )}
                      {order.payment_status === "pending" && (
                        <button
                          type="button"
                          onClick={() => openApprove(order)}
                          className="text-sm text-green-600 hover:underline"
                        >
                          确认收款
                        </button>
                      )}
                      {order.payment_status === "approved" && order.order_status === "confirmed" && (
                        <button
                          type="button"
                          onClick={() => archiveOrder(order)}
                          className="text-sm text-slate-600 hover:underline"
                        >
                          归档
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {total > 0 && (
            <div className="flex-shrink-0 mt-4 pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
              <p className="text-sm text-slate-600">
                共 {total} 条，第 {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, total)} 条
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => load(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => totalPages <= 7 || p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, i, arr) => {
                    const prev = arr[i - 1];
                    const showEllipsis = prev != null && p - prev > 1;
                    return (
                      <span key={p} className="flex items-center gap-1">
                        {showEllipsis && <span className="px-1 text-slate-500">…</span>}
                        <button
                          type="button"
                          onClick={() => load(p)}
                          className={`min-w-[2rem] rounded-lg px-2 py-1.5 text-sm ${currentPage === p ? "bg-indigo-600 text-white" : "border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                        >
                          {p}
                        </button>
                      </span>
                    );
                  })}
                <button
                  type="button"
                  onClick={() => load(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 确认收款弹窗 */}
      {approveModal && approvingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10" onClick={() => setApproveModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-medium mb-4">确认收款</h3>
            <p className="text-sm text-slate-600">订单号 {approvingOrder.id}</p>
            <p className="text-sm text-slate-600">订单金额 ¥{approvingOrder.total_amount}</p>
            <div className="mt-3">
              <label className="block text-sm text-slate-600 mb-1">实际收款金额</label>
              <input
                type="text"
                value={approveAmount}
                onChange={(e) => setApproveAmount(e.target.value.replace(/[^\d.]/g, ""))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="请输入实际收款金额"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setApproveModal(false)} className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-slate-700 hover:bg-slate-100">
                取消
              </button>
              <button type="button" onClick={submitApprove} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700">
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 修改实收弹窗 */}
      {editActualModal && editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10" onClick={() => setEditActualModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-medium mb-4">修改实际收款金额</h3>
            <p className="text-sm text-slate-600">订单号 {editingOrder.id}</p>
            <p className="text-sm text-slate-600">订单金额 ¥{editingOrder.total_amount}</p>
            <div className="mt-3">
              <label className="block text-sm text-slate-600 mb-1">实际收款金额</label>
              <input
                type="text"
                value={editActualAmount}
                onChange={(e) => setEditActualAmount(e.target.value.replace(/[^\d.]/g, ""))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="请输入实际收款金额"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setEditActualModal(false)} className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-slate-700 hover:bg-slate-100">
                取消
              </button>
              <button type="button" onClick={submitEditActual} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700">
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
