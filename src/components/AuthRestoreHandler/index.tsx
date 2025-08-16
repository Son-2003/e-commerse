import React from "react";
import { useAuthRestore } from "../../hook/useAuthRestore";

export const AuthRestoreHandler: React.FC = () => {
  useAuthRestore();
  return null;
};
