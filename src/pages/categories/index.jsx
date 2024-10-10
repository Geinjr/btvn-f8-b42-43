import axios from "axios";
import { FCommonTable } from "../../components";
import { useState, useEffect } from "react";
import { CategoryDialog } from "../../components";
import { Button, Alert } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { DialogContext } from "../../utils";
export default function () {
    const baseApi = import.meta.env.VITE_BASE_API;
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);
    const [categories, setCategories] = useState([]);
    const [currCategory, setCurrCategory] = useState({});
    const [msgSuccess, setMsgSuccess] = useState("");

    const columns = [
        {
            text: "Id",
            name: "id",
        },
        {
            text: "Name",
            name: "name",
        },
        {
            text: "Order Number",
            name: "orderNum",
        },
        {
            text: "",
            name: "action",
        }
       
    ];

    const getCategories = async () => {
        // fetch categories from server
        const response = await axios.get(`${baseApi}/categories`);
        setCategories(response.data);
    };

    useEffect(() => {
        getCategories();
    }, []);

    const onUpdate = (category) => {
        setShowDialog(true);
        setCurrCategory(category);
    };

    const onCreate = () => {
        setShowDialog(true);
    };

    const onDelete = (id) => {
        axios.delete(`${baseApi}/categories/${id}`);
        setCategories(categories.filter((category) => category.id !== id));
        setMsgSuccess("Delete category");
    };

    const onCloseDialog = () => {
        setShowDialog(false);
        setCurrCategory({id: "", name: "", orderNum: "" });
    };

    useEffect(() => {
        setTimeout(() => {
            setMsgSuccess("");
        }, 2500);
    }, [msgSuccess]);
    const [rows, setRows] = useState([]);



    return (
        <>
            <h1 className="text-center">Category</h1>
            {msgSuccess==="Create category" && (
                <Alert variant="filled" severity="success" className="top-50px left-50 translate-minus-50 fixed">
                    Thêm danh mục thành công
                </Alert>)
            }
            {msgSuccess==="Update category" && (
                <Alert variant="filled" severity="success" className="top-50px left-50 translate-minus-50 fixed">
                    Cập nhật danh mục thành công
                </Alert>)
            }
            {msgSuccess==="Delete category" && (
                <Alert variant="filled" severity="success" className="top-50px left-50 translate-minus-50 fixed">
                    Xóa danh mục thành công
                </Alert>)
            }
            <div style={{ maxWidth: "1000px", margin: "auto" }}>
                <Button
                    variant="outlined"
                    startIcon={<HomeIcon />}
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    Home
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    className="float-right"
                    onClick={onCreate}
                >
                    New Category
                </Button>
                <FCommonTable
                    maxWidth={1000}
                    columns={columns}
                    rows={categories}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
                <DialogContext.Provider value={{showDialog:showDialog}}>
                    <CategoryDialog
                        onClose={onCloseDialog}
                        width={500}
                        reload={getCategories}
                        currCategory={currCategory}
                        setMsgSuccess={setMsgSuccess}
                    />
                </DialogContext.Provider>
            </div>
        </>
    );
}
