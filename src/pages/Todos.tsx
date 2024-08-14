import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import TodoSkeleton from "../components/TodoSkeleton";
import Paginator from "./Paginator";
import { ChangeEvent, useState } from "react";

const TodosPage = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("DESC");

  const onClickPrev = () => {
    setPage((prev) => prev - 1);
  };
  const onClickNext = () => {
    setPage((prev) => prev + 1);
  };

  const onChangePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(+e.target.value);
  };
  const onChangeSortBy = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const { isLoading, data, isFetching } = useAuthenticatedQuery({
    queryKey: [`todos-page-${page}`, `${pageSize}`, `${sortBy}`],
    url: `/todos?pagination[pageSize]=${pageSize}&pagination[page]=${page}&sort=createdAt:${sortBy}`,
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-1 p-3">
        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}{" "}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between space-x-2 text-md mb-4">
        <select
          className="border-2 border-indigo-600 rounded-md p-2"
          value={sortBy}
          onChange={onChangeSortBy}
        >
          <option disabled>Sort by</option>
          <option value="ASC">Oldest</option>
          <option value="DESC">Latest</option>
        </select>
        <select
          className="border-2 border-indigo-600 rounded-md p-2"
          value={pageSize}
          onChange={onChangePageSize}
        >
          <option disabled>Page Size</option>
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      <div className="space-y-1">
        {data.data.length ? (
          data.data.map(
            ({
              id,
              attributes,
            }: {
              id: number;
              attributes: { title: string };
            }) => (
              <div
                key={id}
                className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
              >
                <p className="w-full font-semibold">{attributes.title}</p>
              </div>
            )
          )
        ) : (
          <h2>No data</h2>
        )}
      </div>
      <Paginator
        isLoading={isLoading || isFetching}
        total={data.meta.pagination.total}
        page={page}
        pageCount={data.meta.pagination.pageCount}
        onClickPrev={onClickPrev}
        onClickNext={onClickNext}
      />
    </>
  );
};

export default TodosPage;
