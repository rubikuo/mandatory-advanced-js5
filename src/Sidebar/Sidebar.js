import React from "react";
import { MdCreateNewFolder, MdFileUpload, MdNoteAdd } from "react-icons/md";
import "./Sidebar.css";
import { Dropbox } from "dropbox";
class Sidebar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      choosedFiles: [],
      path: "",
    };

    this.createFolder = this.createFolder.bind(this)
  }
    

  createFolder() {

    this.props.updateModals(true)
    this.props.updateModalType("create")
    /* var dbx = new Dropbox({ accessToken: this.props.localToken  });

    dbx.filesCreateFolderV2({path: '/MyFolderName'})
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.error(error);
      }); */
  }


  uploadFiles = e => {
    const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
    let dropBox = new Dropbox({ accessToken: this.props.localToken });
    let files = Array.from(e.target.files);

    if (files.length === 0) {
      return;
    }
    this.setState({ choosedFiles: files });
    const file = files[0];
    console.log("file", file.name);
    if (file.size < UPLOAD_FILE_SIZE_LIMIT) {
      dropBox
        .filesUpload({ path: "/" + file.name, contents: file })
        .then(response => {
          console.log(response);
        })
        .catch(function(error) {
          console.error(error);
        });
    } else {
      alert("the file is too big");
    }
  };

  render() {
    console.log(this.props.localToken);
    console.log(this.props.modals)

    let elements;
    if (this.props.name === "sidebarMenu") {
      elements = (
        <div className="menu_list">
          <ul>
            <li>Home</li>
            <li>Files</li>
          </ul>
        </div>
      );
    }

    if (this.props.name === "sidebarButtons") {
      elements = (
        <div className="menu_list">
          <ul>
            <li>
              <label>
                <MdFileUpload
                  size="20px"
                  style={{
                    position: "relative",
                    top: "4px",
                    marginRight: "5px"
                  }}
                />
                Upload files
                <input
                  style={{ display: "none" }}
                  multiple
                  onChange={this.uploadFiles}
                  value={this.state.choosedFile}
                  type="file"
                  accept=".pdf, .jpg"
                />
              </label>
            </li>
            <li>
              <label>
                <MdCreateNewFolder
                  size="20px"
                  style={{
                    position: "relative",
                    top: "4px",
                    marginRight: "5px"
                  }}
                />
               <button onClick = {this.createFolder}>Create Folder</button>
              </label>
            </li>
          </ul>
        </div>
      );
    }

    return <>{elements}</>;
  }
}

export default Sidebar;
