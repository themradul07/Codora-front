import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE
  ? import.meta.env.VITE_API_BASE
  : "https://krishi-backend-1-e2vy.onrender.com/api";

// POST JSON
// export async function postJSON(path, body) {
//   try {
//     const token = await localStorage.getItem('token');
//     console.log("this is the token inside api js", body);
//     const res = await axios.post(
//       `${API_BASE}${path}`,
//       body,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {})
//         }
//       }
//     );

//     console.log("this is the res from api js", res);
//     return res.data;
//   } catch (err) {
//     console.error("POST Error:", err);
//     throw (err.response?.data || err);
//   }
// }

// // GET JSON
// export async function getJSON(path) {
//   const token = await localStorage.getItem('token');
//   try {
//     const res = await axios.get(
//       `${API_BASE}${path}`,
//       {
//         headers: {
//           ...(token ? { Authorization: `Bearer ${token}` } : {})
//         }
//       }
//     );

//     return res.data;
//   } catch (err) {
//     console.error("GET Error:", err);
//     throw (err.response?.data || err);
//   }
// }


/**
 * ============================
 * 🔥 TYPE DEFINITIONS (JSDoc)
 * ============================
 */

/**
 * @typedef {Object} BuyerSellerPayload
 * @property {"buy"|"sell"} type
 * @property {string} postingDate
 * @property {string} title
 * @property {{amount: number, unit: string}} price
 * @property {{amount: number, unit: string}} quantity
 * @property {{
 *  name: string,
 *  variety: string,
 *  location: string,
 *  buyingFrequency?: string
 * }} product
 * @property {{
 *   name?: string,
 *   state?: string,
 *   image?: string,
 *   phone?: string
 * }} contractorInfo
 * @property {string[]} [images]
 */

/**
 * @typedef {Object} PaginationQuery
 * @property {number} [page]
 * @property {number} [limit]
 * @property {"price"|"date"} [sort]
 * @property {"asc"|"desc"} [order]
 * @property {string} [buyingFrequency]
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {string} message
 * @property {any} [data]
 */

/**
 * @typedef {Object} DeleteParams
 * @property {string} id - MongoDB document ID
 */


/**
 * ============================
 * 🔥 POST JSON (Typed)
 * ============================
 */

/**
 * @param {string} path
 * @param {BuyerSellerPayload} body
 * @returns {Promise<ApiResponse>}
 */
export async function postJSON(path, body) {
  try {
    const token = await localStorage.getItem("token");

    const res = await axios.post(
      `${API_BASE}${path}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    );

    return res.data;
  } catch (err) {
    console.error("POST Error:", err);
    throw (err.response?.data || err);
  }
}

/**
 * ============================
 * 🔥 GET JSON (Typed)
 * ============================
 */

/**
 * @param {string} path
 * @param {PaginationQuery} [query]
 * @returns {Promise<ApiResponse>}
 */
export async function getJSON(path, query = {}) {
  const token = await localStorage.getItem("token");

  try {
    const queryString = new URLSearchParams(query).toString();

    const res = await axios.get(
      `${API_BASE}${path}?${queryString}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    );

    return res.data;
  } catch (err) {
    console.error("GET Error:", err);
    throw (err.response?.data || err);
  }
}

/**
 * ============================
 * 🔥 DELETE JSON (Typed)
 * ============================
 */

/**
 * @param {string} path
 * @param {DeleteParams} params
 * @returns {Promise<ApiResponse>}
 */
export async function deleteJSON(path, params) {
  const token = await localStorage.getItem("token");


  try {
    const res = await axios.delete(
      `${API_BASE}${path}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        params: {
          ...params
        }

      }
    );

    return res.data;
  } catch (err) {
    console.error("DELETE Error:", err);
    throw (err.response?.data || err);
  }
}
/**
 * ============================
 * 🔥 PUT JSON (Typed)
 * ============================
 */

/**
 * @param {string} path
 * @param {BuyerSellerPayload} body
 * @returns {Promise<ApiResponse>}
 */
export async function putJSON(path, body) {
  try {
    const token = await localStorage.getItem("token");

    const res = await axios.put(
      `${API_BASE}${path}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    );

    return res.data;
  } catch (err) {
    console.error("PUT Error:", err);
    throw (err.response?.data || err);
  }
}
