import swal from 'sweetalert';
import { axiosInstance } from "../config/axios";

export const getProducts = async (
  key,
  { page, limit },
  query,
  category = 'buyRequests'
) => {
  try {
    if (!category) category = "buyRequests"
    console.log("entered here", page, limit, category);
    const { data } = await axiosInstance.get(
      `/products?category=${category}&page=${page}&perPage=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (err) {
      swal('Error', `${err.response.data.message}`, 'error');
  }
};

export const saveProducts = async (value) => {
  try {
    console.log('values', value)
    const formData = new FormData();
    formData.append('file', value.value);
    const { data } = await axiosInstance.post(
      `/products`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
      swal('Success', `${data.message}`, 'success');
    return data;
  } catch (err) {
      swal('Error', `${err.response.data.message}`, 'error');
  }
};

export const searchProducts = async (
  key,
  { page, limit },
  queryString,
  category = "buyRequests"
) => {
  try {
    if (!category) category = "buyRequests"
    if (!queryString) return;
    console.log("entered search", page, limit, category, key, queryString);

    const { data } = await axiosInstance.get(
      `/products/search?category=${category}&page=${page}&perPage=${limit}&queryString=${queryString}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log('bge', data)
    return data;
  } catch (err) {
      swal('Error', `${err.response.data.message}`, 'error');
  }
};