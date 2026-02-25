// src/services/allAPI.js

import commonAPI from "../Service/commonApi";
import { SERVER_URL } from "../Service/serverUrl";

// ---------------- USER ----------------

export const syncUserAPI = (headers) =>
  commonAPI("GET", `${SERVER_URL}/users/sync`, {}, headers);

export const updateUserAPI = (body, headers) =>
  commonAPI("PUT", `${SERVER_URL}/users/update`, body, headers);


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
