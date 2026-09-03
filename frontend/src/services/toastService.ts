import toast from 'react-hot-toast';

export const toastService = {
  success: (message: string) => {
    toast.success(message);
  },

  error: (message: string) => {
    toast.error(message);
  },

  info: (message: string) => {
    toast(message, {
      icon: 'ℹ️',
    });
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  promise: async <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string;
      error: string;
    }
  ): Promise<T> => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  },
};