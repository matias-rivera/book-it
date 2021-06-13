import React from "react";
import { Alert, Skeleton, Divider } from "antd";
import "./styles/ListingsSkeleton.css";

interface Props {
    title: string;
    error?: boolean;
}

export const ListingSkeleton = ({ title, error = false }: Props) => {
    const errorAlert = error ? (
        <Alert
            type="error"
            message="Something went wrong"
            className="listings-skeleton__alert"
        />
    ) : null;
    return (
        <div className="listings-skeleton">
            {errorAlert}
            <h2>{title}</h2>
            <Skeleton active paragraph={{ rows: 1 }} />
            <Divider />
            <Skeleton active paragraph={{ rows: 1 }} />
            <Divider />
            <Skeleton active paragraph={{ rows: 1 }} />
        </div>
    );
};
