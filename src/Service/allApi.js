// src/services/allAPI.js

import commonAPI from "../Service/commonApi";
import { SERVER_URL } from "../Service/serverUrl";

// ---------------- USER ----------------

export const syncUserAPI = (headers) =>
  commonAPI("GET", `${SERVER_URL}/users/sync`, {}, headers);

export const updateUserAPI = (body, headers) =>
  commonAPI("PUT", `${SERVER_URL}/users/update`, body, headers);

export const getCurrentUserAPI = (headers) =>
  commonAPI("GET", `${SERVER_URL}/users/me`, {}, headers);

export const getAllUsersAdminAPI = (headers) =>
  commonAPI("GET", `${SERVER_URL}/users`, {}, headers);

export const updateUserRoleAdminAPI = (body, headers) =>
  commonAPI("PUT", `${SERVER_URL}/users/role`, body, headers);
// ---------------- PRODUCTS ----------------

export const getAllProductsAPI = (query) =>
  commonAPI("GET", `${SERVER_URL}/products?${query}`);

export const getSingleProductAPI = (id) =>
  commonAPI("GET", `${SERVER_URL}/products/${id}`);

export const createProductAPI = (body, headers) =>
  commonAPI("POST", `${SERVER_URL}/products`, body, headers);

export const updateProductAPI = (id, body, headers) =>
  commonAPI("PUT", `${SERVER_URL}/products/${id}`, body, headers);

export const deleteProductAPI = (id, headers) =>
  commonAPI("DELETE", `${SERVER_URL}/products/${id}`, {}, headers);


// ---------------- ORDERS ----------------

export const createOrderAPI = (body, headers) =>
  commonAPI("POST", `${SERVER_URL}/orders`, body, headers);

export const getMyOrdersAPI = (headers) =>
  commonAPI("GET", `${SERVER_URL}/orders/my`, {}, headers);

export const getOrderByIdAPI = (id, headers) =>
  commonAPI("GET", `${SERVER_URL}/orders/${id}`, {}, headers);

export const updateOrderStatusAPI = (id, body, headers) =>
  commonAPI("PUT", `${SERVER_URL}/orders/${id}`, body, headers);

export const getAllOrdersAdminAPI = (headers) =>
  commonAPI("GET", `${SERVER_URL}/orders`, {}, headers);



//  admin products 
export const getAllProductsAdminAPI = (headers) =>
  commonAPI("GET", `${SERVER_URL}/products/admin/products`, {}, headers);


// ---------------- CART ----------------

export const addToCartAPI = (body, headers) =>
  commonAPI("POST", `${SERVER_URL}/cart/add`, body, headers);

export const getCartAPI = (headers) =>
  commonAPI("GET", `${SERVER_URL}/cart`, {}, headers);

export const removeFromCartAPI = (body, headers) =>
  commonAPI("DELETE", `${SERVER_URL}/cart/remove`, body, headers);

export const updateCartQuantityAPI = (body, headers) =>
  commonAPI("PUT", `${SERVER_URL}/cart/update`, body, headers);



// payment verify 

export const verifyPaymentAPI = (sessionId, reqHeader) => {
  return commonAPI(
    "GET",
    `/orders/verify/${sessionId}`,
    "",
    reqHeader
  );
};