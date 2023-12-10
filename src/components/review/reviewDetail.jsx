import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {addReviewLikedUsersById, deleteReviewLikedUsersById, findReviewById,} from "../../clients/review_client";
import {addLikedReview, findUserById, removeLikedReview} from "../../clients/user_client";
import {findTagById} from "../../clients/tag_client";
import {IoHeartOutline, IoHeartSharp} from "react-icons/io5";
import Modal from 'react-modal';
import './review.css';

export default function ReviewDetail() {
    const {reviewId} = useParams();
    const [review, setReview] = useState(null);
    const [user, setUser] = useState(null);
    const [author, setAuthor] = useState(null);
    const [likedUsers, setLikedUsers] = useState([]);
    const [tags, setTags] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const currentUserId = useSelector((state) => state.currentUser.userId);
    const currentUserRole = useSelector((state) => state.currentUser.role);
    console.log("Current user role:", currentUserRole)
    const navigate = useNavigate();

    const navigateToUserProfile = (userId) => {
        console.log(`Navigating to user profile with ID: ${userId}`);
        navigate(`/profile/${userId}`);
    };

    const isLiked = user && user.likedReviews.includes(reviewId);

    useEffect(() => {
        async function fetchData() {
            try {
                if (currentUserId) {
                    const userRes = await findUserById(currentUserId);
                    setUser(userRes);
                }

                const reviewRes = await findReviewById(reviewId);
                setReview(reviewRes);

                const authorRes = await findUserById(reviewRes.author_id);
                setAuthor(authorRes);

                const tagLabels = await Promise.all(reviewRes.tags.map(async (tagId) => {
                    return await findTagById(tagId);
                    }
                ));
                setTags(tagLabels);

            } catch (err) {
                console.error("Error fetching data:", err);
            }
        }

        fetchData();
    }, [currentUserId, reviewId]);

    const handleLikeReview = async () => {
        if (currentUserId) {
            const alreadyLikedReview = user.likedReviews.includes(reviewId);
            console.log("Current User ID:", currentUserId);

            try {
                if (alreadyLikedReview) {
                    await deleteReviewLikedUsersById(reviewId, currentUserId);
                    await removeLikedReview(currentUserId, reviewId);
                } else {
                    await addReviewLikedUsersById(reviewId, currentUserId);
                    await addLikedReview(currentUserId, reviewId);
                }

                const updatedUser = await findUserById(currentUserId);
                setUser(updatedUser);

                const updatedReview = await findReviewById(reviewId);
                setReview(updatedReview);
            } catch (error) {
                console.error("Error toggling like on the review:", error);
            }
        } else {
            // If there is no currentUserId, set showModal to true to display the modal
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    // Function to fetch all users who liked the review
    const fetchLikedUsers = async () => {
        console.log(likedUsers);
        // Make sure review.likedUsers is available and is an array
        if (review && Array.isArray(review.likedUsers)) {
            const userDetailsPromises = review.likedUsers.map((userId) => findUserById(userId));
            const userDetails = await Promise.all(userDetailsPromises);

            // Set the likedUsers state with the fetched user details
            setLikedUsers(userDetails.filter((user) => user)); // filter out any possible null/undefined values
        }
    };

    useEffect(() => {
        // Call fetchLikedUsers when the review is fetched or updated
        fetchLikedUsers();
    }, [review]);


    if (!review || !author || !tags) {
        return <div>Loading...</div>;
    }

    console.log("review:", review);


    return (
        <div className="card">
            <div className="card-header">
                <h4 className="card-title text-center">{review.title}</h4>
                <h5 className="card-subtitle text-muted text-center">
                    Reviewed by:
                    <span className="ml-3"
                          style={{cursor: "pointer", color: "gray"}}
                          onClick={() => navigateToUserProfile(author._id)}
                    >
                    {`${author.firstName} ${author.lastName}`}
                </span>
                </h5>

            </div>

            <div className="card-body">
                <div className="">
                    <p className="card-text whitespace-pre-line">{review.body}</p>
                </div>
            </div>

            <div className="card-footer-detail">
                <div className="justify-content-between">
                    <div className="row pl-8">

                        {/* Display tags */}
                        {review && review.tags && (
                            <div>
                                <span className="mr-2">Tags:</span>
                                <div className="tags-container">
                                    {tags.map((tag, index) => (
                                        <span key={index} className="tag">{tag.label}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="row">

                        {/* Render Like Button Conditionally */}
                        {currentUserRole !== 'Author' && (
                            <button className="like-button" onClick={handleLikeReview}>
                                {isLiked ? <IoHeartSharp style={{color: "red"}}/> : <IoHeartOutline/>}
                            </button>
                        )}

                        {/* Check if review.likedUsers is defined and render the label and list */}
                        {review && review.likedUsers && (
                            <div>
                                <span className="mr-2">Liked By:</span>
                                {likedUsers.map((likedUser, index) => (
                                    <span
                                        key={likedUser._id}
                                        style={{cursor: "pointer", color: "grey"}}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigateToUserProfile(likedUser._id);
                                        }}
                                    > {index > 0 && ", "} {likedUser.firstName} {likedUser.lastName} </span>
                                ))}
                            </div>
                        )}


                    </div>

                </div>
            </div>

            <Modal
                isOpen={showModal}
                onRequestClose={closeModal}
                overlayClassName="dimmed-background"
                className="modal-container"
            >
                <div className="justify-items-center">
                <p>Please Sign In to like reviews</p>
                <br/>
                <button className="btn-danger pl-15" onClick={() => navigate('/signin')}>Sign In</button>
                </div>
            </Modal>
        </div>
    );
}
