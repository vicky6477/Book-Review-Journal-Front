import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchBookInfo } from "../clients/openlib_client.js";
import BookCardLarger from "../components/book/bookCardLarger.jsx";
import ReviewList from "../components/review/reviewList.jsx";

const BookDetail = () => {
    const { olid } = useParams();
    const [bookDetails, setBookDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Fetch the book details
                const bookData = await fetchBookInfo(olid);
                // Assuming that the function returns the first book in case of multiple results
                setBookDetails(bookData[0]);

                console.log("olid: ", olid);

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [olid]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            {/* Book details section */}
            {bookDetails && <BookCardLarger book={bookDetails} />}

            {/* Reviews section */}
            <div>
                <h1>Related Reviews</h1>
                {/* Pass the book's OLID to the ReviewListing component */}
                {/* ReviewListing will handle displaying the reviews or a message if there are none */}
                <ReviewList olid={olid} />
            </div>
        </div>
    );
};

export default BookDetail;
