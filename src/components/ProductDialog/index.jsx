import React, { useState, useEffect } from "react";
import {TextField} from "@mui/material";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Alert from "@mui/material/Alert";
import "../../index.css";
import { v4 } from "uuid";
import DialogContainer from "../DialogContainer";
import axios from "axios";
import {validateInput} from "../../utils/Validate.jsx";import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import {readFile} from '../../utils'
import ImageGallery from "../upload/upload.jsx";


export default function ({onClose, currProduct, reload, categories = [], setMsgSuccess}) {
    const [url, setUrl] = useState(null)
    const baseApi = import.meta.env.VITE_BASE_API;
    const [product, setProduct] = useState(currProduct);
    const [error, setError] = useState(null);
    useEffect(() => {
        setError(null);
        if(currProduct.id) {
            setProduct(currProduct);
        } else {
            setProduct({
                id: v4(),
                name: "",
                categoryId: "",
                orderNum: "",
            });
        }
    }, [currProduct]);

    const onInput= (e)=>{
        setProduct({...product, [e.target.name]: e.target.value})
        setError(null);
    }

    const onChangeCategory = (e) => {
        setProduct({...product, categoryId: e.target.value});
        setError(null);
    }

    const onSave = async () => {

        if(validateInput(product, "product")) {
            setError(validateInput(product, "product"));
            return;
        }
        
        if(!currProduct.id) {
            // create product
            try {
                const response= await axios.post(`${baseApi}/products`, product,{
                    headers: {
                        "Content-Type" : "application/json"
                    }
                })
                if(response.data) {
                    setMsgSuccess("Create product");
                    onClose();
                    reload();
                }
            } catch (error) {
                console.log(error);
            }
        }else {
            // update product
            try {
                const response = await axios.put(`${baseApi}/products/${currProduct.id}`, product, {
                    headers: {
                        "Content-Type" : "application/json"
                    }
                })
                if(response.data) {
                    setMsgSuccess("Update product");
                    onClose();
                    reload();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });

      
      const [uploadedFiles, setUploadedFiles] = useState([]);

      const onUploadFile = async (event) => {
        const files = Array.from(event.target.files); // Lấy danh sách các file
        const uploadedFilesArray = [];
        const currentUploadedCount = uploadedFiles.length;

        // Kiểm tra số lượng file đã upload
        if (currentUploadedCount + files.length > 4) {
            alert('You can upload a maximum of 4 images.');
            return;
        }
    
    
        for (const selectedFile of files) {
            if (selectedFile && selectedFile.type.startsWith('image/')) {
                const payload = await readFile(selectedFile); // Đọc file để lấy dữ liệu Base64
    
                // Tạo URL tạm để hiển thị ảnh
                setUrl(URL.createObjectURL(selectedFile));
    
                // Cập nhật danh sách file đã upload
                uploadedFilesArray.push({
                    fileName: selectedFile.name,
                    fileData: payload, // Dữ liệu file mã hóa Base64
                    productId: product.id // Thêm productId vào
                });
    
                // Gửi file đến json-server
                const response = await fetch(`${baseApi}/files`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fileName: selectedFile.name,
                        fileData: payload, 
                        productId: product.id 
                    }),
                });
    
                const result = await response.json();
                console.log('File uploaded:', result); // In ra kết quả upload
            } else {
                alert('Please upload only image files.'); // Thông báo nếu file không phải là ảnh
            }
        }
    
        // Cập nhật danh sách file đã upload sau khi vòng lặp hoàn tất
        setUploadedFiles((prevFiles) => [...prevFiles, ...uploadedFilesArray]);
    };
   
  
    return (
        <>
            <DialogContainer action={currProduct.id ? "Update" : "Create"} type="product" onClose={onClose} onSave={onSave}>
    <ImageGallery uploadedFiles={uploadedFiles} />
            <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload files
      <VisuallyHiddenInput
        type="file"
        onChange={onUploadFile}
        multiple
      />
    </Button>
            <TextField
                    required
                    margin="dense"
                    name="name"
                    label="Product Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    onInput={onInput}
                    value={product.name}
                />
                
                <FormControl variant="standard" fullWidth>
                    {error && (
                        <Alert variant="filled" severity="error" className="top-50px left-50 translate-minus-50 fixed">
                            {error}
                        </Alert>
                    )}
                    <InputLabel id="demo-simple-select-standard-label">Category</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={product.categoryId}
                        onChange={onChangeCategory}
                        label="Category"
                        >
                        {categories.map((category)=>{
                            return <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                        })}
                    </Select>
                </FormControl>
                <TextField
                    required
                    margin="dense"
                    name="orderNum"
                    label="Order Number"
                    type="number"
                    fullWidth
                    variant="standard"
                    onInput={onInput}
                    value={product.orderNum}
                />
                    
            </DialogContainer>
        </>
    )
}