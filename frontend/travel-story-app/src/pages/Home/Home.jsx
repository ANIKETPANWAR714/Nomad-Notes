import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { MdAdd } from 'react-icons/md';
import TravelStoryCard from '../../components/cards/TravelStoryCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import AddEditStory from './AddEditStory';
import ViewTravelStory from './ViewTravelStory'; // Corrected the import name

const Home = () => {
  const navigate = useNavigate();
  const [userinfo, setUserinfo] = useState('');
  const [allStories, setAllStories] = useState([]);
  const [filtertype, setFilterType] = useState('');
  const [searchBarQuery, setSearchQuery] = useState('');
  const [openAddEditModal, setOpenEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null
  });

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data && response.data.user) {
        setUserinfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get('/get-all-stories');
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error occurred while fetching stories");
    }
  };

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  const handleEdit = (data) => {
    setOpenEditModal({ isShown: true, type: 'edit', data });
  };

  const updateIsFavourite = async (data, index) => {
    const storyId = data._id;
    const newIsFavourite = !data.isFavourite;
    const updatedStories = [...allStories];

    if (newIsFavourite) {
      updatedStories[index].isFavourite = true;
      const [favoritedStory] = updatedStories.splice(index, 1);
      updatedStories.unshift(favoritedStory);
    } else {
      updatedStories[index].isFavourite = false;
    }

    setAllStories(updatedStories);

    try {
      const response = await axiosInstance.put('/update-isFavourite/' + storyId, {
        isFavourite: newIsFavourite,
      });

      if (response.data && response.data.message === "Update successful") {
        toast.success("Story Updated Successfully");
      }
    } catch (error) {
      console.error("An unexpected error occurred while updating favorite status", error);
      toast.error("Failed to update story");
      getAllTravelStories(); // Refresh stories if there's an error
    }
  };

  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get('/search', {
        params: { query },
      });

      // Check if the response contains the expected structure
      if (response.data && response.data.story) {
        setFilterType('search');
        setAllStories(response.data.story); // Update stories based on the search
      } else {
        console.log("No stories found for the query.");
        setAllStories([]); // Clear stories if none are found
      }
    } catch (error) {
      console.error("An unexpected error occurred while searching stories:", error);
      toast.error("Failed to search stories"); // Notify user of the error
    }
  };

  const handleClearSearch = () => {
    setFilterType("");
    setSearchQuery(''); // Clear search input
    getAllTravelStories(); // Fetch all stories again
  };

  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
  }, []);

  return (
    <>
      <NavBar 
        userinfo={userinfo} 
        searchBarQuery={searchBarQuery} 
        setSearchQuery={setSearchQuery} 
        onSearchNote={onSearchStory} 
        handleClearSearch={handleClearSearch}
      />
      <div className='container mx-auto py-10'>
        <div className='flex gap-7'>
          <div className='flex-1'>
            {allStories.length > 0 ? (
              <div className='grid grid-cols-2 gap-4'>
                {allStories.map((item, index) => {
                  if (!item._id) {
                    console.error("Story item does not have an _id:", item); // Log any missing _id
                    return null; // Skip rendering if _id is missing
                  }
                  return (
                    <TravelStoryCard
                      key={item._id}
                      imgUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      onEdit={() => { handleEdit(item); }}
                      onClick={() => { handleViewStory(item); }} // Ensure this triggers the view modal
                      onFavouriteClick={() => { updateIsFavourite(item, index); }}
                    />
                  );
                })}
              </div>
            ) : (
              <>Empty card here</>
            )}
          </div>
          <div className='w-[320px]'></div>
        </div>
      </div>
      
      {/* Add/Edit Story Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenEditModal({ isShown: false, type: 'add', data: null })} // Close modal handler
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999
          }
        }}
        appElement={document.getElementById('root')}
        className="model-box"
      >
        <AddEditStory 
          type={openAddEditModal.type}
          storyinfo={openAddEditModal.data}
          onClose={() => setOpenEditModal({ isShown: false, type: 'add', data: null })}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>
      
      {/* View Travel Story Modal */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => setOpenViewModal({ isShown: false, data: null })} // Ensure modal can be closed
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999
          }
        }}
        appElement={document.getElementById('root')}
        className="model-box"
      >
        <ViewTravelStory 
          onClose={() => { setOpenViewModal((prevstate) => ({ ...prevstate, isShown: false })) }}
          onEditClick={() => { 
            setOpenViewModal((prevstate) => ({ ...prevstate, isShown: false }));
            handleEdit(openViewModal.data); // Pass the actual story data
          }}
          onDeleteClick={() => {}}
          storyinfo={openViewModal.data || null } // Pass story data to ViewTravelStory
        />
      </Modal>

      <button
        className='w-16 h-16 flex justify-center items-center rounded-full bg-primary hover:bg-cyan-600 fixed right-10 bottom-10'
        onClick={() => {
          setOpenEditModal({ isShown: true, type: 'add', data: null });
        }}
      >
        <MdAdd className='text-[32px] text-white ' />
      </button>

      <ToastContainer /> {/* Ensure ToastContainer is rendered */}
    </>
  );
};

export default Home;
