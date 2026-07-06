import styled from "styled-components";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

const buildPageList = (
  totalPages: number,
  currentPage: number,
): (number | "...")[] => {
  return Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(
      (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
    )
    .reduce<(number | "...")[]>((acc, p, i, arr) => {
      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);
};

const TablePagination: React.FC<TablePaginationProps> = ({
  page,
  limit,
  total,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / limit);
  const pageList = buildPageList(totalPages, page);

  return (
    <Wrap>
      <Info>
        Showing{" "}
        <span className="font-medium text-gray-700">
          {(page - 1) * limit + 1}–{Math.min(page * limit, total)}
        </span>{" "}
        of <span className="font-medium text-gray-700">{total}</span>
      </Info>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 rounded-lg border-gray-200"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={15} />
        </Button>

        {pageList.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="text-gray-300 px-1 text-sm">
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={page === p ? "default" : "outline"}
              size="icon"
              className={`w-8 h-8 rounded-lg text-sm ${
                page === p
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white border-0"
                  : "border-gray-200 text-gray-600"
              }`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 rounded-lg border-gray-200"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={15} />
        </Button>
      </div>
    </Wrap>
  );
};

export default TablePagination;

const Wrap = styled.div.attrs({
  className:
    "flex items-center justify-between px-4 py-3 border-t border-gray-100",
})``;

const Info = styled.p.attrs({
  className: "text-sm text-gray-400",
})``;
