import { isAxiosError, useAxios } from "@/composables/useAxios";
import { useNotification } from "@/composables/useNotification";
import type {
  AddCashFlow,
  DeleteCashFlow,
  GetCashFlowList,
  ParamCashFlowList,
  UpdateCashFlow,
} from "@/types/cash-flow.type.ts";

export const getCashFlowList: GetCashFlowList = async (params: ParamCashFlowList) => {
  const axios = useAxios();
  const { notifyError } = useNotification();
  try {
    const { data } = await axios.get("kas-keuangan", { params });

    return data;
  } catch (error: unknown) {
    let message = "Gagal mendapatkan data kas keuangan.";
    if (isAxiosError(error)) {
      message = error.response?.data?.message ?? error.message ?? message;
    }
    notifyError({ title: "Error Message", msg: message });
    throw error;
  }
};
export const postCashFlow: AddCashFlow = async (payload) => {
  const axios = useAxios();
  const { notifySuccess, notifyError } = useNotification();
  try {
    const { data } = await axios.post("kas-keuangan", payload);
    notifySuccess({
      title: "Success Message",
      msg: data.message || "Data kas keuangan berhasil ditambah",
    });
    return data;
  } catch (error: unknown) {
    let message = "Gagal menyimpan data kas keuangan.";
    if (isAxiosError(error)) {
      message = error.response?.data?.message ?? error.message ?? message;
    }
    notifyError({ title: "Error Message", msg: message });
    throw error;
  }
};
export const putCashFlow: UpdateCashFlow = async (id, payload) => {
  const axios = useAxios();
  const { notifySuccess, notifyError } = useNotification();
  try {
    const { data } = await axios.put(`/kas-keuangan/${id}`, payload);
    notifySuccess({
      title: "Success Message",
      msg: data.message || "Data kas keuangan berhasil diubah",
    });
    return data;
  } catch (error: unknown) {
    let message = "Gagal mengubah data kas keuangan.";
    if (isAxiosError(error)) {
      message = error.response?.data?.message ?? error.message ?? message;
    }
    notifyError({ title: "Error Message", msg: message });
    throw error;
  }
};
export const deleteCashFlow: DeleteCashFlow = async (id) => {
  const axios = useAxios();
  const { notifyError } = useNotification();
  try {
    const { data } = await axios.delete(`kas-keuangan/${id}`);
    return data;
  } catch (error: unknown) {
    let message = "Gagal menghapus data kas keuangan.";
    if (isAxiosError(error)) {
      message = error.response?.data?.message ?? error.message ?? message;
    }
    notifyError({ title: "Error Message", msg: message });
    throw error;
  }
};
