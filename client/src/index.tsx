import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
    ApolloProvider,
    ApolloClient,
    InMemoryCache,
    useMutation,
    createHttpLink,
    ApolloLink,
    HttpLink,
    from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Layout, Affix, Spin } from "antd";
import reportWebVitals from "./reportWebVitals";
import "./styles/index.css";

/* Components */
import {
    AppHeader,
    Home,
    Host,
    Listing,
    Listings,
    NotFound,
    User,
    Login,
} from "./sections";

import { AppHeaderSkeleton, ErrorBanner } from "./lib/components";

import { LOG_IN } from "./lib/graphql/mutations";
import {
    LogIn as LogInData,
    LogInVariables,
} from "./lib/graphql/mutations/LogIn/__generated__/LogIn";
import { Viewer } from "./lib/types";

const httpLink = new HttpLink({ uri: "/api" });
const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    const token = sessionStorage.getItem("token");
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            "X-CSRF-TOKEN": token || "",
        },
    }));

    return forward(operation);
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: from([authMiddleware, httpLink]),
});

/* const client = new ApolloClient({
    uri: "/api",

    cache: new InMemoryCache(),
    
}); */

const initialViewer: Viewer = {
    id: null,
    token: null,
    avatar: null,
    hasWallet: null,
    didRequest: false,
};

const App = () => {
    const [viewer, setViewer] = useState<Viewer>(initialViewer);
    const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
        onCompleted: (data) => {
            if (data && data.logIn) {
                setViewer(data.logIn);
                if (data.logIn.token) {
                    sessionStorage.setItem("token", data.logIn.token);
                } else {
                    sessionStorage.removeItem("token");
                }
            }
        },
    });

    const logInRef = useRef(logIn);
    useEffect(() => {
        logInRef.current();
    }, []);

    if (!viewer.didRequest && !error) {
        return (
            <Layout className="app-skeleton">
                <AppHeaderSkeleton />
                <div className="app-skeleton__spin-section">
                    <Spin size="large" tip="Launching App" />
                </div>
            </Layout>
        );
    }

    const logInErrorBannerElement = error ? (
        <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later." />
    ) : null;

    return (
        <Router>
            <Layout id="app">
                {logInErrorBannerElement}
                <Affix offsetTop={0} className="app__affix-header">
                    <AppHeader viewer={viewer} setViewer={setViewer} />
                </Affix>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/host" component={Host} />
                    <Route exact path="/listing/:id" component={Listing} />
                    <Route
                        exact
                        path="/listings/:location?"
                        component={Listings}
                    />
                    <Route
                        exact
                        path="/login"
                        render={(props) => (
                            <Login {...props} setViewer={setViewer} />
                        )}
                    />
                    <Route exact path="/user/:id" component={User} />
                    <Route component={NotFound} />
                </Switch>
            </Layout>
        </Router>
    );
};

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
