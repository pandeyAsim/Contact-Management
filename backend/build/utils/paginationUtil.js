"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagingData = exports.getPagination = exports.decodeGetQuery = void 0;
const decodeGetQuery = (query) => {
    const page = Math.abs(parseInt(query.page, 10)) || 1;
    const size = Math.abs(parseInt(query.size, 10)) || 10;
    const search = query.search || "";
    const sortBy = query.sort || "createdAt";
    const orderBy = query.order || "desc";
    return { page, size, search, sortBy, orderBy };
};
exports.decodeGetQuery = decodeGetQuery;
const getPagination = ({ page = 1, size = 10, }) => {
    const limit = Math.max(+size, 1);
    const offset = (Math.max(+page, 1) - 1) * limit;
    return { limit, offset };
};
exports.getPagination = getPagination;
const getPagingData = ({ paginatedData, page = 1, limit = 10, }) => {
    const currentPage = Math.max(+page, 1);
    const itemsPerPage = Math.max(+limit, 1);
    if (!paginatedData) {
        return {
            totalItems: 0,
            data: [],
            totalPages: 0,
            currentPage: 1,
        };
    }
    const { count: totalItems, rows: data } = paginatedData;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return {
        totalItems,
        data,
        totalPages,
        currentPage,
    };
};
exports.getPagingData = getPagingData;
