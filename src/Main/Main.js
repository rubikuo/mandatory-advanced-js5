import React, { useState, useEffect } from 'react';
import FileList from '../FileList/FileList';
import './Main.css';
import { FaStar } from 'react-icons/fa';
import { Dropbox } from 'dropbox';

const Main = ({
	localToken,
	documents,
	updateDocs,
	updateItemName,
	updateItemId,
	favorites,
	updateFavorite,
	updateRename,
	location
}) => {
	const [ tab, updateTab ] = useState('name');
	console.log(localToken);

	useEffect(
		() => {
			console.log('location Name', location.pathname);

			let dropbox = new Dropbox({ accessToken: localToken });

			if (location.pathname === '/home') {
				dropbox
					.filesListFolder({ path: '' })
					.then((response) => {
						console.log('resonse.entries', response.entries);
						updateDocs(response.entries); // update in state
						return response.entries;
					})
					.then((docs) => {
						// adding a new key to the data, to be able to control the check button next to the list
						let datas = [ ...docs ];
						datas.map((data) => {
							return (data.favorite = false);
						});
						// save the data with the new key
						updateDocs(datas);
					});
			} else {
				console.log('this is not a home, link is', location.pathname);
				let newPath = location.pathname.slice(5);
				console.log(newPath);
				dropbox
					.filesListFolder({ path: newPath })
					.then((response) => {
						// console.log('resonse.entries', response.entries);
						updateDocs(response.entries); // update in state
						return response.entries;
					})
					.then((docs) => {
						// adding a new key to the data, to be able to control the check button next to the list
						let datas = [ ...docs ];
						datas.map((data) => {
							return (data.favorite = false);
						});
						// save the data with the new key
						updateDocs(datas);
					});
			}
		},
		[ location.pathname, localToken, updateDocs ]
	);

	const showTab = (tabName) => {
		updateTab(tabName);
	};

	let tabActiveStyle = {
		backgroundColor: '#F7F7F7',
		color: 'rgb(34, 138, 208)'
	};

	const getLinkToFile = (path) => {
		let dropbox = new Dropbox({ accessToken: localToken });
		dropbox
			.filesGetTemporaryLink({ path: path })
			.then((response) => {
				window.location.href = response.link;
			})
			.catch(function(error) {
				console.error(error, 'Error by downloading file');
			});
	};

	return (
		<main>
			<div className="titleBar">
				<div className="tabsCtn">
					<div className="tabs" style={tab === 'name' ? tabActiveStyle : {}} onClick={() => showTab('name')}>
						<p>Files</p>
					</div>
					<div
						className="tabs"
						style={tab === 'stared' ? tabActiveStyle : {}}
						onClick={() => showTab('stared')}
					>
						<p>Starred</p>
						<FaStar size="18px" style={{ position: 'relative', top: '-1px' }} />
					</div>
				</div>
				<div className="tagCtn">
					<p className="metaTag">Size</p>
					<p className="modifiedTag">Modified</p>
				</div>
			</div>
			<ul>
				{Array.from(documents).map((doc) => {
					return (
						<FileList
							key={doc.id}
							doc={doc}
							getLinkToFile={getLinkToFile}
							updateItemId={updateItemId}
							updateItemName={updateItemName}
							favorites={favorites}
							updateFavorite={updateFavorite}
							updateRename={updateRename}
							location={location}
							documents={documents}
							updateDocs={updateDocs}
						/>
					);
				})}
			</ul>
		</main>
	);
};

export default Main;
