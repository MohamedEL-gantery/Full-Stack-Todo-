const TodoSkeleton = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div
          className="h-2 bg-gray-300 rounded-sm
             dark:bg-gray-500 mb-2.5 w-32"
        ></div>
      </div>
      <div className=" flex items-center space-x-2">
        <div className="h-9 bg-gray-300 rounded-md dark:bg-gray-500 w-12"></div>
        <div className="h-9 bg-gray-300 rounded-md dark:bg-gray-500  w-12"></div>
      </div>
    </div>
  );
};

export default TodoSkeleton;
