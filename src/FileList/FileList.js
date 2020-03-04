/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFolder, FaStar, FaRegStar, FaFile, FaFilePdf, FaBars, FaWindowRestore} from 'react-icons/fa';
import './FileList.css';
import { convertDate } from './convertDate.js';
import { convertBytes } from './convertBytes.js';
import { toggleFavorite } from '../store';
import Remove from "../Modals/Remove";
import Rename from "../Modals/Rename";
import { Dropbox } from 'dropbox';

const FileList = ({
	doc,
	location,
	itemId,
	itemName,
	getLinkToFile,
	favorites,
	updateDocs,
	documents,
	localToken
}) => {


	const [ dropDown, updateDropDown ] = useState(false);
	const [ showRemoveModal, updateRemoveModal] =useState(false);
	const [ showRenameModal, updateRenameModal] =useState(false);
	const [ fileBlob, updatefileBlob] =useState({});

	   
	useEffect(()=>{
		let dropbox = new Dropbox({ accessToken: localToken });
		if(doc.name.slice(doc.name.length - 3) === "jpg" || "jpeg"){
			dropbox.filesGetThumbnail({path: doc.path_lower, format:'jpeg', size:'w64h64', mode:'strict' })
			.then((response)=>{
				console.log(response.fileBlob)
				updatefileBlob(response.fileBlob);
			})
			.catch((error)=>{
				console.log(error);
			})
		}

	},[doc.name, localToken, doc.path_lower])

	const showDropDown = (e) => {
		updateDropDown(dropDown ? false : true);
	};

	const handleRemoveModal =()=>{
		updateRemoveModal(true);
	}

	const handleRenameModal =()=>{
		updateRenameModal(true);
	}

	let dropdownClass;
	if (dropDown) {
		dropdownClass = 'dropDown active';
	} else {
		dropdownClass = 'dropDown';
	}

	const handleFav = (doc) => {
		toggleFavorite(doc);
	};



	if (doc) {
		let button;
      
        if (favorites.find(x => x.id === doc.id)){
          button = <FaStar size="20px"  style={{color: "rgb(250, 142, 0)", position:"relative", top: "3px"}}/>
        } else {
          button = <FaRegStar size="20px"style={{position:"relative", top: "3px"}}/>
        }
		return (
	
			<li className="item">
				<div className="itemSmlCtn">
          <span className="starIcon" onClick={() => handleFav(doc)}>
              <span>{button}</span>
          </span>
					{doc['.tag'] === 'file' ? (
						<>
							{doc.name.slice(doc.name.length - 3) === "pdf" ? (<FaFilePdf size="2rem" className="folderIcon"/>) : 
							(<img src="" alt=""/>)}
							<a
								className="documentLink" //href will be a new key?
								onClick={() => getLinkToFile(doc.path_lower)}
							>
								{doc.name}
							</a>
						</>
					) : (
						<>
							<FaFolder size="2rem" className="folderIcon" />
							<Link to={"/home" + doc.path_lower} className="documentLink">{doc.name}</Link>
						</>
					)}
				</div>
				<p className="metaData">{doc['.tag'] === 'file' ? convertBytes(doc.size) : '--'}</p>
				<p className="modified">{convertDate(doc.client_modified)}</p>
				<div className="dropDownCtn">
					<button onClick={showDropDown} id={doc.id}>
						<FaBars size="14px" style={{position:"relative", top:"3px", color:"#737373"}}/>
					</button>
					<div className={dropdownClass}>
						<button
							className="deleteBtn"
							onClick={handleRemoveModal}
						>
							Delete
						</button>
						{showRemoveModal && <Remove updateRemoveModal={updateRemoveModal} location={location} itemId={itemId} itemName={itemName} doc={doc} updateDocs={updateDocs} documents={documents}  />}

						<button
							className="renameBtn"
							onClick={handleRenameModal}
						>
							Rename
						</button>
						{showRenameModal && <Rename doc={doc} updateRenameModal={updateRenameModal} documents={documents} updateDocs={updateDocs} />}
					</div>
				</div>
			</li>
		);
	}
};

export default FileList;
