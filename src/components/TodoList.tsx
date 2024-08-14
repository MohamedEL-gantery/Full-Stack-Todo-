import { ChangeEvent, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputErrorMsg from "../components/InputErrorMsg";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interface";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import { ITodo } from "../interface";
import Textarea from "./ui/Textarea";
import { updateSchema } from "../validation";
import TodoSkeleton from "./TodoSkeleton";
import { faker } from "@faker-js/faker";

type Inputs = {
  title?: string;
  description?: string;
};

type InputsAdd = {
  title: string;
  description: string;
};

const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [query, setQuery] = useState(1);
  const [isOPenAddModal, setIsOPenAddModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [cancelRemove, setCancelRemove] = useState(false);

  const [todoEdit, setTodoEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: "",
  });

  const [addTodo, setAddTodo] = useState({
    title: "",
    description: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs | InputsAdd>({
    resolver: yupResolver(updateSchema),
  });

  const { isLoading, data } = useAuthenticatedQuery({
    queryKey: ["todos", `${query}`],
    url: "/users/me?populate=todos",
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

  const onChangeAddHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAddTodo({
      ...addTodo,
      [name]: value,
    });
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setTodoEdit({
      ...todoEdit,
      [name]: value,
    });
  };

  const onEditModal = (todo: ITodo) => {
    setTodoEdit(todo);
    setIsEditModalOpen(true);
  };

  const openConfirmModal = (todo: ITodo) => {
    setTodoEdit(todo);
    setCancelRemove(true);
  };

  const closeConfirmModal = () => {
    setTodoEdit({
      id: 0,
      title: "",
      description: "",
    });
    setCancelRemove(false);
  };

  const onCloseModal = () => {
    setTodoEdit({
      id: 0,
      title: "",
      description: "",
    });
    setIsEditModalOpen(false);
  };

  const onOpenAddModal = () => setIsOPenAddModal(true);

  const onCloseAddModal = () => {
    setAddTodo({
      title: "",
      description: "",
    });
    setIsOPenAddModal(false);
  };

  const onSubmitCreateHandler: SubmitHandler<Inputs> = async (fromData) => {
    setIsUpdating(true);
    try {
      const { title, description } = fromData;
      const { status } = await axiosInstance.post(
        "/todos",
        {
          data: { title, description, user: [userData.user.id] },
        },
        { headers: { Authorization: `Bearer ${userData.jwt}` } }
      );

      if (status === 200) {
        setQuery((prev) => prev + 1);
        onCloseAddModal();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };
  const onSubmitUpdateHandler: SubmitHandler<Inputs> = async (formData) => {
    setIsUpdating(true);
    try {
      const { status } = await axiosInstance.put(
        `/todos/${todoEdit.id}`,
        { data: { ...formData } },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      if (status === 200) {
        toast.success("Todo updated successfully!");
        setQuery((prev) => prev + 1);
        onCloseModal();
      }
    } catch (err) {
      const errorObj = err as AxiosError<IErrorResponse>;
      toast.error(`${errorObj.response?.data.error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const onRemoveHandler = async () => {
    try {
      const { status } = await axiosInstance.delete(`/todos/${todoEdit.id}`, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });
      if (status === 200) {
        closeConfirmModal();
        setQuery((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onGenerateTodos = async () => {
    //100 record
    for (let i = 0; i < 100; i++) {
      try {
        const { data } = await axiosInstance.post(
          `/todos`,
          {
            data: {
              title: faker.word.words(5),
              description: faker.lorem.paragraph(2),
              user: [userData.user.id],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${userData.jwt}`,
            },
          }
        );
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="space-y-1">
      <div className="w-fit mx-auto my-10">
        <div className="flex items-center space-x-2">
          <Button size={"sm"} onClick={onOpenAddModal}>
            Post new todo
          </Button>
          <Button size={"sm"} onClick={onGenerateTodos} variant={"outline"}>
            Generate todos
          </Button>
        </div>
      </div>

      {data.todos.length ? (
        data.todos.map((todo: ITodo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
          >
            <p className="w-full font-semibold">{todo.title}</p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button
                size={"sm"}
                onClick={() => onEditModal(todo)}
                type="button"
              >
                Edit
              </Button>
              <Button
                variant={"danger"}
                size={"sm"}
                onClick={() => openConfirmModal(todo)}
                type="button"
              >
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h2>No data</h2>
      )}
      {/* ADD TODO MODAL */}
      <Modal
        isOpen={isOPenAddModal}
        closeModal={onCloseAddModal}
        title={"Create todo"}
      >
        <form
          className="space-y-3"
          onSubmit={handleSubmit(onSubmitCreateHandler)}
        >
          <Input
            value={addTodo.title}
            {...register("title")}
            onChange={onChangeAddHandler}
          />
          {errors.title && <InputErrorMsg msg={errors.title?.message} />}
          <Textarea
            {...register("description")}
            value={addTodo.description}
            onChange={onChangeAddHandler}
          />
          {errors.description && (
            <InputErrorMsg msg={errors.description?.message} />
          )}
          <div className="flex justify-center space-x-20 mt-3">
            <Button variant={"default"} isLoading={isUpdating}>
              Done
            </Button>
            <Button variant={"cancel"} onClick={onCloseAddModal} type="button">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        closeModal={onCloseModal}
        title={"Edit this todo"}
      >
        <form
          className="space-y-3"
          onSubmit={handleSubmit(onSubmitUpdateHandler)}
        >
          <Input
            value={todoEdit.title}
            {...register("title")}
            onChange={onChangeHandler}
          />
          {errors.title && <InputErrorMsg msg={errors.title?.message} />}
          <Textarea
            {...register("description")}
            value={todoEdit.description}
            onChange={onChangeHandler}
          />
          {errors.description && (
            <InputErrorMsg msg={errors.description?.message} />
          )}
          <div className="flex justify-center space-x-20 mt-3">
            <Button variant={"default"} isLoading={isUpdating}>
              Update
            </Button>
            <Button variant={"cancel"} onClick={onCloseModal} type="button">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      {/* DELETE MODAL*/}
      <Modal
        isOpen={cancelRemove}
        closeModal={closeConfirmModal}
        title="Are you sure want to remove this Todo from your Store? "
        description="Deleting this Todo will remove it permanently from your inventory. Any associated data, sale history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex items-center space-x-3 mt-3">
          <Button variant={"danger"} onClick={onRemoveHandler}>
            Yes, remove
          </Button>
          <Button variant={"cancel"} onClick={closeConfirmModal} type="button">
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
