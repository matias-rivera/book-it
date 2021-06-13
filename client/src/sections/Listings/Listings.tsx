import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { gql } from "apollo-boost";
import { Listings as ListingData } from "./__generated__/Listings";
import {
    DeleteListing as DeleteListingData,
    DeleteListingVariables,
} from "./__generated__/DeleteListing";

import { Alert, Avatar, Button, List, Spin } from "antd";

import "./styles/Listings.css";
import { ListingSkeleton } from "./components";

const LISTINGS = gql`
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

const DELETE_LISTING = gql`
    mutation DeleteListing($id: ID!) {
        deleteListing(id: $id) {
            id
        }
    }
`;

interface Props {
    title: string;
}

export const Listings = ({ title }: Props) => {
    const { data, refetch, loading, error } = useQuery<ListingData>(LISTINGS);

    const [
        deleteListing,
        { loading: deleteListingLoading, error: deleteListingError },
    ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

    const handleDeleteListings = async (id: string) => {
        await deleteListing({ variables: { id } });
        refetch();
    };

    const listings = data ? data.listings : null;

    const listingsList = listings ? (
        <List
            itemLayout="horizontal"
            dataSource={listings}
            renderItem={(listing) => (
                <List.Item
                    actions={[
                        <Button
                            type="primary"
                            onClick={() => handleDeleteListings(listing.id)}
                        >
                            Delete
                        </Button>,
                    ]}
                >
                    <List.Item.Meta
                        title={listing.title}
                        description={listing.address}
                        avatar={
                            <Avatar
                                src={listing.image}
                                shape="square"
                                size={48}
                            />
                        }
                    />
                </List.Item>
            )}
        />
    ) : null;

    if (loading) {
        return (
            <div className="listings">
                <ListingSkeleton title={title} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="listings">
                <ListingSkeleton title={title} error />
            </div>
        );
    }
    const deleteListingErrorAlert = deleteListingError ? (
        <Alert
            type="error"
            message="Something went wrong"
            className="listings__alert"
        />
    ) : null;

    return (
        <div className="listings">
            <Spin spinning={deleteListingLoading}>
                {deleteListingErrorAlert}
                <h2>{title}</h2>
                {listingsList}
            </Spin>
        </div>
    );
};
