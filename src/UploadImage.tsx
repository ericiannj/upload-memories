import React, {useState, useRef } from 'react';
import { Grid, Segment, Header, Button, Input, TextArea, Loader } from '@fluentui/react-northstar';
import { AddIcon, SearchIcon } from '@fluentui/react-icons-northstar'

import './UploadImage.css';

interface ImagePayload {
    order: number,
    id: string | undefined,
    imageSrc: string | undefined,
    title: string,
    description: string,
    deleted: boolean
} 

export const UploadImageBanner: React.FC = ( ) => {
    const hiddenInput = useRef<HTMLInputElement>(null);
    const updateHiddenInput = useRef<HTMLInputElement>(null);
    const loadFileReader = new FileReader();
    const updateFileReader = new FileReader();
    const [selectedFile, setSelectedFile] = useState<ImagePayload>({ 
        order: 0,
        id: undefined,
        imageSrc: '',
        title: '',
        description: '',
        deleted: false
    })
    const [files, setFiles] = useState<ImagePayload[]>([]);
    const [deletedFiles, ] = useState<ImagePayload[]>([]);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [reload, callReload] = useState(false);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {      
        const fileWithEmptyTitle = files.some((item) => item.title === '');
        if(!fileWithEmptyTitle) {
            setIsButtonEnabled(true);
        } else {
            setIsButtonEnabled(false);
        }
    }, [selectedFile, files])

    const loadImage = (e: any) => {
        const uploadedFile = e.target.files[0];
        setLoading(true);  
        if(!uploadedFile) {
            return;
        }
        loadFileReader.readAsDataURL(uploadedFile);
    }

    loadFileReader.addEventListener('loadend', function(load){
        if(files.length >= 8){
            return;
        }
        if (load !== null) {
            const previewImg = load.target!.result as string; // base64 da imagem
            callReload(true);
            setSelectedFile({
                order: files.length,
                id : undefined, 
                imageSrc: previewImg,
                title: '',
                description: '',
                deleted: false
            })  
            setFiles(filesLoaded => [...filesLoaded, {
                order: files.length,
                id : undefined, 
                imageSrc: previewImg,
                title: '',
                description: '',
                deleted: false
            }]); 
            callReload(false);
            setLoading(false); 
        }
    })

    const updateImage = (e: any) => {
        const uploadedFile = e?.target?.files[0];
        setLoading(true); 
        if(!uploadedFile) {
            return;
        }
        updateFileReader.readAsDataURL(uploadedFile);
    }

    updateFileReader.addEventListener('loadend', function(load){        
        if(selectedFile.order < 0){
            return;
        }
        setLoading(true);
        if (load !== null) {
            const previewImg = load.target!.result as string
            const filesArray = files;
            setSelectedFile({...selectedFile, imageSrc: previewImg })
            filesArray[selectedFile.order] = {...files[selectedFile.order], imageSrc: previewImg}
            setFiles(filesArray);
        }
        setLoading(false);
    })
    
    const handleClickInput = () => {
        hiddenInput?.current?.click()
    }

    const handleUpdate = () => {
        updateHiddenInput?.current?.click()
    }

    const handleChangeTitle = (event:any) => {
        const filesArray = files;
        setSelectedFile({...selectedFile, title: event.target.value })
        filesArray[selectedFile.order] = {...files[selectedFile.order], title: event.target.value}
        setFiles(filesArray);
    }

    const handleChangeDescription = (event: any) => {
        const filesArray = files;
        setSelectedFile({...selectedFile, description: event.target.value })
        filesArray[selectedFile.order] = {...files[selectedFile.order], description: event.target.value}
        setFiles(filesArray);
    }

    const handleRemoveImage = () => {
        const filesArray = files;
        if(selectedFile.order < 0){
            return;
        }
        if (selectedFile.order !== undefined) {
            const deletedFile = {...selectedFile, deleted: true }
            setSelectedFile(deletedFile)
            deletedFiles.push(deletedFile)
        }
        const filteredArray = filesArray.filter(item => item.order !== selectedFile.order);
        const mappedArray = filteredArray.map((item, index) => ({
            ...item,
            order: index + 1 
        }))
        setFiles(mappedArray);
        setSelectedFile(files.length > 1 ? mappedArray[mappedArray.length - 1] : { 
            order: 0,
            id : undefined, 
            title: '',
            description: '',
            imageSrc: undefined,
            deleted: false
        })     
    }

    const EmptyContainer = () => {
        return <Button circular icon={<AddIcon />} size="medium" title="Add Image" onClick={handleClickInput}/>
    }

	return (
        <>
            <Grid columns="repeat(4, 1fr)" rows="50px 350px 70px" id="grid-container">
                <Segment
                    color="brand"
                    content={<Header as="h3" className="app-title" color="white" content="Upload Memories" />}
                    inverted
                    styles={{
                        gridColumn: 'span 4',
                    }}
                />
                <Segment
                    color="grey"
                    content={selectedFile.imageSrc ?
                        <div className="info-container">
                            <div>
                                <Header as="h3" color="white" content="Memory Info" />
                            </div>
                            <div>
                                <Input 
                                    fluid
                                    name="title" 
                                    placeholder="Title"
                                    className="info-title"
                                    autoComplete="off" 
                                    icon={<SearchIcon />}  
                                    iconPosition="start"  
                                    onChange={e => handleChangeTitle(e)} 
                                    value={selectedFile.title} 
                                />
                            </div>
                            <div>
                                <TextArea 
                                    fluid
                                    name="description" 
                                    placeholder="Description"
                                    className="info-description"
                                    autoComplete="off" 
                                    onChange={e => handleChangeDescription(e)} 
                                    value={selectedFile.description} 
                                />
                            </div>
                            <div>
                                <Button content="Delete Memory" tinted onClick={handleRemoveImage} disabled={loading}/>
                            </div>
                        </div> :
                        <div className="empty-image-description">
                             <Header as="h2" color="white" content="Upload an Image" />
                        </div>
                    }
                    inverted
                    styles={{
                      gridColumn: 'span 2',
                    }}
                />
                <Segment
                    color="white"
                    content={!selectedFile.imageSrc ?
                        <div className="empty-preview-container">
                            <EmptyContainer/>
                        </div> :
                        <div className="image-preview-container">
                            {selectedFile.imageSrc && <img id="aaaa" src={selectedFile.imageSrc} className="selected-image-preview" alt="Imagem" onClick={handleUpdate}/>}
                        </div>
                    }
                    inverted
                    styles={{
                      gridColumn: 'span 2',
                    }}
                />
                <Segment
                    color="brand"
                    content={
                        <div>
                            <ul className="file-list">
                                {!reload && files.map((uploadedFile) => (
                                <li key={uploadedFile.id} className="file-blocks" > 
                                    <div className={selectedFile.order === uploadedFile.order ? 'files-selected' : 'files-default'}>
                                        <div>
                                            <img src={uploadedFile.imageSrc} className="image-block"  alt="Imagem Carregada" onClick={() => setSelectedFile(uploadedFile)}/>
                                        </div>
                                    </div>
                                </li>
                                ))}
                                {selectedFile.imageSrc &&
                                    <div className="new-image-button-container">
                                        <Button circular icon={<AddIcon />} size="medium" title="Add Image" onClick={handleClickInput} disabled={loading || files.length >=8}/>
                                    </div>
                                }
                                <form> 
                                    <input type="file" id="input-image" name='imagem' ref={hiddenInput} onChange={e => loadImage(e)} disabled={files.length >= 8} />
                                    <input type="file" id="input-image-update" name='updateImage' ref={updateHiddenInput} onChange={e => updateImage(e)} disabled={files.length >= 8} />
                                </form>
                            </ul>                                      
                        </div>
                    }
                    inverted
                    styles={{
                    gridColumn: 'span 4',
                    }}
                />
                <Segment
                    color="grey"
                    content={
                        <div className="botton-div">
                            <div className="loader-image">
                                {loading && <Loader label="Loading Image..." labelPosition="end"/> }
                            </div>
                            <div className="submit-button-container">
                                <Button content="Save Memories" primary disabled={loading || !isButtonEnabled} />
                            </div> 
                        </div>
                    }
                    inverted
                    styles={{
                    gridColumn: 'span 4',
                    }}
                />
            </Grid>
        </>
    );
}

export default UploadImageBanner;  