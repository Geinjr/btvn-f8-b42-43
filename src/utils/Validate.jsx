
export const validateInput = (input, type) => {
    if (type === "product") {
        if (
            input.name === "" ||
            input.categoryId === "" ||
            input.orderNum === ""
        ) {
            return "Vui lòng nhập đầy đủ thông tin";
            
        }
        if (
            input.orderNum % 1 !== 0 ||
            input.orderNum < 1 ||
            input.orderNum > 9999
        ) {
            return "Vui lòng nhập số nguyên từ 1-9999";
            
        }
        if (input.name.length > 30) {
            return "Tên sản phẩm tối đa 30 ký tự";
            
        }
        if (input.categoryId.charAt(0) === "0") {
            return "Category ID không được bắt đầu bằng 0";
            
        }
        if (input.orderNum.charAt(0) === "0") {
            return "Order Number không được bắt đầu bằng 0";
            
        }
    }
    if (type === "category") {
        if (input.name === "" || input.orderNum === "") {
            return "Vui lòng nhập đầy đủ thông tin";
            
        }
        if (
            input.orderNum % 1 !== 0 ||
            input.orderNum < 1 ||
            input.orderNum > 9999
        ) {
            return "Vui lòng nhập số nguyên từ 1-9999";
            
        }
        if (input.name.length > 30) {
            return "Tên danh mục tối đa 30 ký tự";
            
        }
        if (input.orderNum.charAt(0) === "0") {
            return "Order Number không được bắt đầu bằng 0";
            
        }
    }
    return null;
};
