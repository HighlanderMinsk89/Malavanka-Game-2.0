import { useCallback } from "react";

export const useMessage = () => {
  return useCallback((text, type) => {
    if (window.M && text) {
      window.M.toast({
        html: text,
        displayLength: "6000",
        classes:
          type === "success" ? "green darken-3" : "yellow darken-2 black-text",
      });
    }
  }, []);
};
