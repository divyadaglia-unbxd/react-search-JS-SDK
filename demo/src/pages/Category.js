import React, { useState, useContext } from 'react';
import { Route, useHistory, useLocation } from 'react-router-dom';


import UnbxdSearchWrapper from '../../../src/index';

import Strings from './Strings';
import Balls from './Balls';
import Accessories from './Accessories';
import Grips from './Grips';
import Home from './Home';
import { ProductTypeContext } from '../context';
import { searchConfigurations } from '../config';
import MobileModal from '../components/MobileModal';
import SearchBar from '../components/SearchBar';
import { scrollTop } from '../utils';
import { useEffect } from 'react';

export const getCategoryId = () => {
    if (window.UnbxdAnalyticsConf && window.UnbxdAnalyticsConf['page']) {
        return encodeURIComponent(window.UnbxdAnalyticsConf['page']);
    }
};

export const LoaderComponent = () => {
    return (
        <div className="overlay">
            <div className="overlay__inner">
                <div className="overlay__content">
                    <span className="spinner" />
                </div>
            </div>
        </div>
    );
};

export const ErrorComponent = () => {
    return <div>Something went wrong.</div>;
};

const Category = (props) => {
    const { refreshId, setRefreshId } = props;
    const { productType, setProductType } = useContext(ProductTypeContext);
    
    const [showFilters, setShowFilters] = useState(false);
    const [configs, setConfigs] = useState(searchConfigurations);
    const routeHistory = useHistory();
    const routeLocation = useLocation();

    const handleClose = () => setShowFilters(false);
    const handleShow = () => setShowFilters(true);

    const handleChange = () => {
        setConfigs({
            ...searchConfigurations,
            defaultFilters: { flag: 'article' }
        });
    };

    if(location.href.indexOf("strings") > -1) {
        window.UnbxdAnalyticsConf = {};
    window.UnbxdAnalyticsConf['page'] = 'itemGroupIds:1800';
    window.UnbxdAnalyticsConf['page_type'] = 'BOOLEAN';
    // setProductType("CATEGORY");
    
    } else if (location.href.indexOf("accessories") > -1) {
        window.UnbxdAnalyticsConf = {};
        window.UnbxdAnalyticsConf['page'] = 'itemGroupIds:185';
        window.UnbxdAnalyticsConf['page_type'] = 'BOOLEAN';
        // setProductType("CATEGORY");
       
    } 

    const handleRouteChange = (searchObj, hash, refreshId) => {
        scrollTop();
        const { state = {} } = searchObj;
        const { responseObj = {} } = state;
        const { redirect = {} } = responseObj;
        const { type = '', value } = redirect;
        const urlParams = searchObj.getQueryParams();
        // check if it is the home page and we don't have any query params on the url.
        // return false to ensure sdk makes no further search calls
        if (
            routeLocation.pathname === '/' &&
            Object.keys(urlParams).length === 0 &&
            refreshId
        ) {
            return false;
        } else if (
            // check for redirects
            type === 'url' &&
            typeof value === 'string' &&
            value.length > 0
        ) {
            // if hash already exists, to retain the current state, push on history
            if (routeLocation.pathname === '/' && routeLocation.hash) {
                routeHistory.push(value);
            } else {
                routeHistory.replace(value);
            }
            return true;
        } else {
            // if hash already exists, to retain the current state, push on history
            if (routeLocation.hash && routeHistory.action !== 'POP') {
                routeHistory.push(`${routeLocation.pathname}#${hash}`);
            } else if (hash) {
                routeHistory.replace(`${routeLocation.pathname}#${hash}`);
            }
            return true;
        }
    };

    const onRouteChange = (searchObj, hash, refreshId, that) => {
        debugger;
    }


    return (
        <UnbxdSearchWrapper
        siteKey="ss-unbxd-gcp-Gardner-White-STG8241646781056"
        apiKey="e2082aeb3a7f0ac8955c879daf7673e8"
            getCategoryId={getCategoryId}
            searchConfigurations={configs}
            productType={"CATEGORY"}
            source="category"
            refreshId={refreshId}
            setRefreshId={setRefreshId}
            allowExternalUrlParams={true}
            loaderComponent={<LoaderComponent />}
            errorComponent={<ErrorComponent />}
            onRouteChange={onRouteChange}
            // onUrlBack = {
            //     function() {
            //         this.state.unbxdCore.state.isBack = true;
            //         this.state.unbxdCore.renderFromUrl(window.location.search.replace('?',''));
            //     }
            // }
        >
            <MobileModal showFilters={showFilters} handleClose={handleClose} />
            <SearchBar
                onProductTypeChange={setProductType}
                productType={productType}
                handleShow={handleShow}
                refreshId={refreshId}
                source="category"
                setRefreshId={setRefreshId}
            />
            <button type="button" onClick={handleChange}>
                change
            </button>
            {/* <Route exact path="/">
                <Home setRefreshId={setRefreshId} />
            </Route> */}
            <Route exact path="/strings">
                <Strings />
            </Route>
            {/* <Route exact path="/balls">
                <Balls />
            </Route> */}
            <Route exact path="/accessories">
                <Accessories />
            </Route>
            {/* <Route path="/grips">
                <Grips />
            </Route> */}
        </UnbxdSearchWrapper>
    );
};

export default Category;
