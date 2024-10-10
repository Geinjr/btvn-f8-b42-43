import React from 'react'; 
import "./style.css"
const ImageGallery = ({ uploadedFiles }) => {
    return (
        <div className="image-gallery">
            {uploadedFiles.map((file, index) => (
                <div key={index}>
                    <img className='image-item' src={file.fileData} alt={file.fileName}  />
                </div>
            ))}
        </div>  
    );
};

export default ImageGallery;
