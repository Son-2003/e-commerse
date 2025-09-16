import React from "react";
import { useAuthRestore } from "../../hook/useAuthRestore";
import { useAuthAdminRestore } from "../../hook/useAuthRestoreAdmin";

export const AuthRestoreHandler: React.FC = () => {
  useAuthRestore();
  return null;
};

export const AuthAdminRestoreHandler: React.FC = () => {
  useAuthAdminRestore();
  return null;
};