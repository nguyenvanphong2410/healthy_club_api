import {PER_PAGE} from "@/configs";

export const formatGetListQuery = ({q, page, per_page, field, sort_order}) => {
    q = q ? {$regex: q, $options: "i"} : null;
    page = (page && !isNaN(page) && page > 0) ? parseInt(page) : 1;
    per_page = (per_page && !isNaN(page) && per_page > 0) ? parseInt(per_page) : PER_PAGE;
    field = field || "created_at";
    sort_order = sort_order === "asc" ? 1 : -1;

    return {q, page, per_page, field, sort_order};
};
