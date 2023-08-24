import { toast } from "react-toastify";

export const useToastify = () => {
  const config = {
    position: "top-right",
    autoClose: 2200,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const ToastFactory = {
    error: (msg: string) => {
      toast.error(msg, { ...config });
    },
    info: (msg: string) => {
      toast.info(msg, { ...config });
    },
    success: (msg: string) => {
      toast.success(msg, { ...config });
    },
    warn: (msg: string) => {
      toast.warn(msg, { ...config });
    },
    default: (msg: string) => {
      toast(msg, { ...config });
    },
  };

  return ToastFactory;
};
