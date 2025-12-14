"use client";
import React from "react";
import { CreditCard, Mail, Users, Bell, Plus, FolderOpen } from "./Icons";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h3 className="text-sm font-medium text-gray-900 mb-4 border-b border-gray-100 pb-2">
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const Toggle = ({
  label,
  description,
  active = false,
}: {
  label: string;
  description: string;
  active?: boolean;
}) => (
  <div className="flex items-start justify-between">
    <div>
      <p className="text-sm text-gray-700 font-medium">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{description}</p>
    </div>
    <button
      className={`w-9 h-5 rounded-full transition-colors relative ${
        active ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${
          active ? "translate-x-4" : ""
        }`}
      />
    </button>
  </div>
);

const SettingsView: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl animate-in fade-in slide-in-from-right-4 duration-500">
      <h1 className="text-2xl font-light tracking-tight text-gray-900 mb-8">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-1">
          {["General", "Billing", "Team", "Notifications", "Integrations"].map((item, i) => (
            <button
              key={item}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                i === 1 ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 bg-white/60 backdrop-blur-md border border-gray-200/50 rounded-xl p-8 shadow-sm">
          <Section title="Payment Methods">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-[10px] text-white font-bold tracking-widest">
                  VISA
                </div>
                <div className="text-sm text-gray-700">
                  Ending in <span className="font-mono">4242</span>
                </div>
              </div>
              <button className="text-xs text-blue-600 font-medium hover:underline">Edit</button>
            </div>
            <button className="text-xs flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
              <Plus className="w-3 h-3" /> Add new card
            </button>
          </Section>

          <Section title="Email Notifications">
            <Toggle
              label="New Order Alert"
              description="Receive an email when a customer purchases a course."
              active
            />
            <Toggle
              label="Daily Digest"
              description="A summary of your revenue and traffic every morning."
              active
            />
            <Toggle label="Lead Signups" description="When a new user registers an account." />
          </Section>

          <Section title="Google Drive Integration">
            <div className="flex items-center justify-between p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-md shadow-sm">
                  <FolderOpen className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Service Account Connected</p>
                  <p className="text-xs text-emerald-600">
                    course-bot@project-id.iam.gserviceaccount.com
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Active
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              To change accounts, upload a new JSON key file.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
