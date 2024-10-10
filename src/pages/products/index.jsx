import axios from "axios";
import {FCommonTable} from '../../components';
import {useState, useEffect} from "react";
import {ProductDialog} from '../../components';
import { Button, Alert } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import {DialogContext} from '../../utils';

export default function () {
    const baseApi = import.meta.env.VITE_BASE_API;
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);
    const [products, setProducts] = useState([]);
    const [currProduct, setCurrProduct] = useState({});
    const [msgSuccess, setMsgSuccess] = useState("");
    const [categories, setCategories] = useState([]);
    // const [files , setFiles]=useState([]);

    const columns = [
        {
            text: 'Id',
            name: 'id'
        },
        {
            text: 'Name',
            name: 'name'
        },
        {
            text: 'Category',
            name: 'categoryId',
        },
        {
            text: 'Order Number',
            name: 'orderNum'
        },
        {
            text: '',
            name: 'action'
        }, 
        {
            text: 'Image',
            name: 'images',
            render: (product) => (
                product.images && product.images.length > 0 ? (
                    <img
                        src={`data:image/jpeg;base64,${product.images[0].fileData}`}  // Lấy fileData từ mảng hình ảnh
                        alt={product.name} // Sử dụng tên sản phẩm cho alt
                        width={50} // Kích thước ảnh
                    />
                ) : (
                    'No Image'  // Hiển thị khi không có hình ảnh
                )
            )
           
        }

    ];

    const getCategories = async () => {
        try {
            const response = await axios.get(`${baseApi}/categories`);
            if(response.data){
                setCategories(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }
  
    const getFiles = async () => {
        try {
            // Lấy danh sách các file từ server
            const response = await axios.get(`${baseApi}/files`);
            const filesData = response.data;
            return filesData; // Trả về danh sách file
        } catch (error) {
            console.log('Error fetching files:', error);
            return [];
        }
    }
    
    const getProducts = async () => {
        try {
            // Lấy danh sách sản phẩm
            const response = await axios.get(`${baseApi}/products`);
            const productsData = response.data;
    
            // Lấy dữ liệu hình ảnh từ server
            const filesData = await getFiles();
    
            // Ghép nối hình ảnh vào danh sách sản phẩm dựa trên productId
            const productsWithImages = productsData.map(product => {
                const productImages = filesData.filter(file => file.productId === product.id);
                return {
                    ...product,
                    images: productImages // Thêm mảng hình ảnh vào sản phẩm
                };
            });
    
            // Cập nhật lại danh sách sản phẩm với hình ảnh
            setProducts(productsWithImages);
        } catch (error) {
            console.log('Error fetching products:', error);
        }
    }
    
    

    useEffect(() => {
        getCategories();
        getProducts();
    }, [])

    const onUpdate = (product) => {
        setShowDialog(true);
        setCurrProduct(product);
    }

    const onCreate = () => {
        setShowDialog(true);
    }

    const onCloseDialog = () => {
        setShowDialog(false)
        setCurrProduct({})
    }

    const onDelete = (id) => {
        try {
            axios.delete(`${baseApi}/products/${id}`);
            setProducts(products.filter((product)=>{
                return product.id !== id;
            }))
            setMsgSuccess("Delete product");
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setMsgSuccess("");
        }, 2500);
    }, [msgSuccess]);

    return (
        <>
            <h1 className="text-center">Products</h1>
            {msgSuccess==="Create product" && (
                <Alert variant="filled" severity="success" className="top-50px left-50 translate-minus-50 fixed">
                    Thêm sản phẩm thành công
                </Alert>)
            }
            {msgSuccess==="Update product" && (
                <Alert variant="filled" severity="success" className="top-50px left-50 translate-minus-50 fixed">
                    Cập nhật sản phẩm thành công
                </Alert>)
            }
            {msgSuccess==="Delete product" && (
                <Alert variant="filled" severity="success" className="top-50px left-50 translate-minus-50 fixed">
                    Xóa sản phẩm thành công
                </Alert>)
            }
            <div style={{ maxWidth: "1000px", margin: "auto" }}>
                <Button
                    variant="outlined"
                    startIcon={<HomeIcon />}
                    onClick={() => {
                        navigate("/");
                    }}
                >Home</Button>
                <Button
                    variant="contained"
                    color="success"
                    className="float-right"
                    onClick={onCreate}
                >New Product</Button>
                <FCommonTable
                    maxWidth={1000}
                    columns={columns}
                    rows={products}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
                <DialogContext.Provider value={{showDialog:showDialog}}>
                    <ProductDialog
                        onClose={onCloseDialog}
                        width={500}
                        reload={getProducts}
                        currProduct={currProduct}
                        categories={categories}
                        setMsgSuccess={setMsgSuccess}
                       

                    />
                </DialogContext.Provider>
            </div>
        </>
    )
}