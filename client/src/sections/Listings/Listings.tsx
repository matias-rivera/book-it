import React from "react";
import { server } from "../../lib/api";
import {
    ListingData,
    DeleteListingData,
    DeleteListingVariables,
} from "./types";

const LISTINGS = `
    query Listings {
        listings {
            id
            title
            image
            address
            price
            numOfGuests
            numOfBeds
            numOfBaths
            rating
        }
    }
`;

const DELETE_LISTING = `
    mutation DeleteListing($id: ID!) {
        deleteListing(id:$id){
            id
        }
    }
`;

interface Props {
    title: string;
}

export const Listings = ({ title }: Props) => {
    const fetchListings = async () => {
        const { data } = await server.fetch<ListingData>({ query: LISTINGS });
        console.log(data);
    };

    const deleteListings = async () => {
        const { data } = await server.fetch<
            DeleteListingData,
            DeleteListingVariables
        >({
            query: DELETE_LISTING,
            variables: {
                id: "60c46eea01af8e19d445be7f",
            },
        });
        console.log(data);
    };

    return (
        <div>
            <h2>{title}</h2>
            <button onClick={fetchListings}>Query Listings</button>
            <button onClick={deleteListings}>Delete Listings</button>
        </div>
    );
};
