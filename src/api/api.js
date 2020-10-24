import swal from "sweetalert";
import { navigate } from "@reach/router";
import { axiosInstance } from "../config/axios";

export const getProducts = async (
  key,
  { page, limit },
  query,
  category = "buyRequests"
) => {
  try {
    let min, max;
    if (!category) category = "buyRequests";

    if (query && typeof query === "object") {
      min = query.min;
      max = query.max;
      query = null;
    }

    const { data } = await axiosInstance.get(
      `/products?category=${category}&page=${page}&perPage=${limit}&query=${query}&min=${min}&max=${max}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (err) {
    swal("Error", `${err.response.data.message}`, "error");
  }
};

export const saveProducts = async (value) => {
  try {
    const formData = new FormData();
    formData.append("file", value.value);
    const { data } = await axiosInstance.post(`/products`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    swal("Success", `${data.message}`, "success");
    navigate("/");
    return data;
  } catch (err) {
    swal("Error", `${err.response.statusText}`, "error");
    return "";
  }
};
