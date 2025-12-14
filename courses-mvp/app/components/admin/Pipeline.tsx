"use client";
import React, { useState, useMemo } from "react";
import { OrderStatus, KanbanItem } from "../../../lib/types";
import { INITIAL_PIPELINE } from "../../../lib/constants";
import { MoreHorizontal, Plus, Filter, CheckCircle2, Clock, AlertCircle, XCircle } from "./Icons";

const StatusIcon = ({ status }: { status: OrderStatus }) => {
  switch (status) {
    case OrderStatus.NEW:
      return <div className="w-2 h-2 rounded-full bg-blue-500" />;
    case OrderStatus.PAYMENT_VERIFY:
      return <Clock className="w-3 h-3 text-amber-500" />;
    case OrderStatus.ACCESS_SENT:
      return <div className="w-2 h-2 rounded-full bg-purple-500" />;
    case OrderStatus.COMPLETED:
      return <CheckCircle2 className="w-3 h-3 text-emerald-500" />;
    case OrderStatus.CANCELLED:
      return <XCircle className="w-3 h-3 text-red-500" />;
    default:
      return <div className="w-2 h-2 rounded-full bg-gray-300" />;
  }
};

const Pipeline: React.FC = () => {
  const [items, setItems] = useState<KanbanItem[]>(INITIAL_PIPELINE);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const columns = useMemo(
    () => [
      { id: OrderStatus.NEW, label: "New Orders" },
      { id: OrderStatus.PAYMENT_VERIFY, label: "Verify Payment" },
      { id: OrderStatus.ACCESS_SENT, label: "Access Sent" },
      { id: OrderStatus.COMPLETED, label: "Completed" },
    ],
    []
  );

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = "move";
    // Transparent drag image or default
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: OrderStatus) => {
    e.preventDefault();
    if (!draggedItem) return;

    setItems((prev) => prev.map((item) => (item.id === draggedItem ? { ...item, status } : item)));
    setDraggedItem(null);
  };

  const getItemsByStatus = (status: OrderStatus) => items.filter((i) => i.status === status);

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-gray-900">Pipeline</h1>
          <p className="text-sm text-gray-500 font-light">
            Manage order flow and drive access delivery.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-all shadow-sm">
            <Filter className="w-3 h-3 mr-2" /> Filter
          </button>
          <button className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-all shadow-sm">
            <Plus className="w-3 h-3 mr-2" /> Create Lead
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full min-w-max gap-6 px-2 pb-4">
          {columns.map((col) => (
            <div
              key={col.id}
              className="w-72 flex flex-col h-full rounded-xl bg-gray-50/50 border border-gray-100/50 backdrop-blur-sm"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="p-3 flex justify-between items-center border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <StatusIcon status={col.id} />
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {col.label}
                  </h3>
                  <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded-full">
                    {getItemsByStatus(col.id).length}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3">
                {getItemsByStatus(col.id).map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    className="group bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-grab active:cursor-grabbing relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <img src={item.avatar} className="w-6 h-6 rounded-full" alt="" />
                        <span className="text-xs font-medium text-gray-900">
                          {item.title.split("-")[1]}
                        </span>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 line-clamp-1">{item.subtitle}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
                      <span className="text-xs font-semibold text-gray-700">{item.amount}</span>
                      <span className="text-[10px] text-gray-400">{item.date}</span>
                    </div>
                  </div>
                ))}
                {getItemsByStatus(col.id).length === 0 && (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg">
                    <p className="text-xs text-gray-300">Drop here</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
