import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { PageSkeleton, ErrorBanner } from "../../lib/components";
import { Layout, Col, Row } from "antd";
import { Moment } from "moment";
import { LISTING } from "../../lib/graphql/queries";
import {
    Listing as ListingData,
    ListingVariables,
} from "../../lib/graphql/queries/Listing/__generated__/Listing";
import {
    ListingBookings,
    ListingDetails,
    ListingCreateBooking,
    ListingCreateBookingModal,
} from "./components";
import { Viewer } from "../../lib/types";

interface MatchParams {
    id: string;
}

interface Props {
    viewer: Viewer;
}

const PAGE_LIMIT = 3;
const { Content } = Layout;

export const Listing = ({
    viewer,
    match,
}: Props & RouteComponentProps<MatchParams>) => {
    const [bookingsPage, setBookingsPage] = useState(1);
    const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const { loading, data, error, refetch } = useQuery<
        ListingData,
        ListingVariables
    >(LISTING, {
        variables: {
            id: match.params.id,
            bookingsPage,
            limit: PAGE_LIMIT,
        },
        context: {
            headers: {
                "X-CSRF-TOKEN": sessionStorage.getItem("token"),
            },
        },
    });

    const clearBookingData = () => {
        setModalVisible(false);
        setCheckInDate(null);
        setCheckOutDate(null);
    };

    const handleListingRefetch = async () => {
        await refetch();
    };

    if (loading) {
        return (
            <Content className="listings">
                <PageSkeleton />
            </Content>
        );
    }

    if (error) {
        return (
            <Content className="listings">
                <ErrorBanner description="This listing may not exist or we've encountered an error. Please try again soon!" />
                <PageSkeleton />
            </Content>
        );
    }

    const listing = data ? data.listing : null;
    const listingBookings = listing ? listing.bookings : null;

    const listingDetailsElement = listing ? (
        <ListingDetails listing={listing} />
    ) : null;

    const listingBookingsElement = listingBookings ? (
        <ListingBookings
            listingBookings={listingBookings}
            bookingsPage={bookingsPage}
            limit={PAGE_LIMIT}
            setBookingsPage={setBookingsPage}
        />
    ) : null;

    const listingCreateBooking = listing ? (
        <ListingCreateBooking
            viewer={viewer}
            host={listing.host}
            price={listing.price}
            bookingsIndex={listing.bookingsIndex}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            setCheckInDate={setCheckInDate}
            setCheckOutDate={setCheckOutDate}
            setModalVisible={setModalVisible}
        />
    ) : null;

    const listingCreateBookingModalElement =
        listing && checkInDate && checkOutDate ? (
            <ListingCreateBookingModal
                id={listing.id}
                price={listing.price}
                modalVisible={modalVisible}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                setModalVisible={setModalVisible}
                clearBookingData={clearBookingData}
                handleListingRefetch={handleListingRefetch}
            />
        ) : null;

    return (
        <Content className="listings">
            <Row gutter={24} typeof="flex" justify="space-between">
                <Col xs={24} lg={14}>
                    {listingDetailsElement}
                    {listingBookingsElement}
                </Col>
                <Col xs={24} lg={10}>
                    {listingCreateBooking}
                </Col>
            </Row>
            {listingCreateBookingModalElement}
        </Content>
    );
};
