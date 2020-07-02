import React from 'react';
import PropTypes from 'prop-types';

import SwatchItem from '../swatches';
import { List } from '../../../../components';
import { getProductFields } from '../../utils';

class GridProductCard extends React.Component {

    constructor(props) {
        super(props);

        const { itemData,
            productAttributes,
            showVariants,
            variantAttributes,
            showSwatches,
            swatchAttributes,
            groupBy
        } = this.props;

        //Get the datas from the product bases on productAttributes and create the card
        const productValues = getProductFields({
            itemData,
            productAttributes,
            showVariants,
            variantAttributes,
            showSwatches,
            swatchAttributes,
            groupBy
        });

        this.state = { productValues };
    }

    onSwatchClick = (event) => {

        const currentSwatchId = event.target.dataset['variant_id'];

        this.setState((currentState) => {
            return {
                productValues: {
                    ...currentState.productValues,
                    swatches: currentState.productValues.swatches.map(swatchObject => {
                        if (swatchObject.swatchId === currentSwatchId) {
                            return { ...swatchObject, active: true }
                        } else {
                            return { ...swatchObject, active: false }
                        };
                    })
                }
            }
        })
    }



    render() {

        const { SwatchItemComponent, idx, onClick } = this.props;
        const { productValues } = this.state;
        const [activeSwatch] = productValues['swatches'].filter((swatch) => {
            return swatch.active
        });

        const product = { ...productValues, ...activeSwatch };
        const {
            uniqueId,
            productName,
            imageUrl,
            productUrl,
            price,
            sellingPrice,
            swatches } = product;

        const prank = idx + 1;

        //Add support for router as a config
        return (<div className='UNX-product-card-container'>

            <a href={productUrl} className={`UNX-product-card UNX-grid-card`} data-uniqueid={uniqueId} data-prank={prank} onClick={onClick}>
                <img className='UNX-image' src={imageUrl} data-uniqueid={uniqueId} data-prank={prank} />
                <p className='UNX-product-name' data-uniqueid={uniqueId} data-prank={prank}>{productName}</p>
                <p className='UNX-price' data-uniqueid={uniqueId} data-prank={prank}>{price}</p>
                <p className='UNX-selling-price' data-uniqueid={uniqueId} data-prank={prank}>{sellingPrice}</p>
            </a>

            <div className='UNX-swatch-content'>
                <List
                    items={swatches}
                    ListItem={SwatchItemComponent || SwatchItem}
                    idAttribute={'swatchId'}
                    onClick={this.onSwatchClick}
                    className='UNX-swatch-item-list-container' />
            </div>

        </div>)
    }
}

GridProductCard.propTypes = {
    itemData: PropTypes.object.isRequired,
    productAttributes: PropTypes.object.isRequired,
    showVariants: PropTypes.bool.isRequired,
    variantAttributes: PropTypes.object.isRequired,
    showSwatches: PropTypes.bool,
    swatchAttributes: PropTypes.object,
    groupBy: PropTypes.string
}

export default GridProductCard;
