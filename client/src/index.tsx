import React from "react";
import ReactDOM from "react-dom";
//import ApolloClient from "apollo-boost";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import reportWebVitals from "./reportWebVitals";

import { Listings } from "./sections";

const client = new ApolloClient({
    uri: "/api",
    cache: new InMemoryCache(),
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <Listings title="HotelApp Title" />
    </ApolloProvider>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
